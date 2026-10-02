"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useReducedMotion } from "motion/react";

/**
 * Beams (React Bits, reescrito) — colunas verticais de luz com bordas nitidas.
 * O original usa three.js + react-three-fiber (centenas de KB, geometria 3D);
 * aqui sao colunas analiticas num unico fragment shader (ogl, ~30 KB): cada
 * coluna tem largura e nivel de brilho proprios e um gradiente vertical suave
 * que se desloca com o tempo.
 *
 * Velocidade: o tempo so corre quando o usuario interage (mouse, roda, scroll
 * ou toque). Em repouso a velocidade e `idleSpeed` (0) e o loop de render para.
 *
 * Performance:
 * - render pausado fora da viewport, com a aba oculta e em repouso (rAF cancelado);
 * - DPR limitado e qualidade adaptativa: se o frame time passar de ~24 ms,
 *   a resolucao interna cai em degraus (as colunas sao suaves, ninguem nota);
 * - movimento reduzido: um unico frame estatico, sem loop;
 * - perda de contexto WebGL (comum no mobile) recria o renderer.
 */
export interface BeamsCanvasProps {
  /** Cor das colunas claras, as impares: porcelana (rgb 0-1). */
  color?: [number, number, number];
  /** Cor das colunas vermelhas, as pares (rgb 0-1). */
  accent?: [number, number, number];
  /** Rotacao das colunas em radianos (0 = vertical). */
  angle?: number;
  intensity?: number;
  grain?: number;
  /** Velocidade enquanto ha interacao (escala do React Bits: 10 = maxima). */
  speed?: number;
  /** Velocidade em repouso, sem mouse/scroll/toque. */
  idleSpeed?: number;
  /** Chamado apos o primeiro frame desenhado (para o fade-in). */
  onReady?: () => void;
  className?: string;
}

const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float uTime;
uniform vec2 uRes;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uAngle;
uniform float uIntensity;
uniform float uGrain;

const int BEAMS = 16;
const float NBEAMS = 16.0;
const float TAU = 6.2831853;
// Suavizacao da borda entre colunas (anti-alias, em unidades de coluna).
const float EDGE = 0.006;
// Opacidade maxima relativa de cada familia de coluna (branco bem mais sutil).
const float RED_GAIN = 0.65;
const float WHITE_GAIN = 0.67;

float hash(float n) {
  return fract(sin(n * 127.1 + 311.7) * 43758.5453);
}

float hash2(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Larguras irregulares: algumas colunas estreitas, outras largas.
float beamWidth(float i) {
  return 0.16 + 0.3 * hash(i * 1.37 + 4.0);
}

// Brilho da coluna i na altura y (0 = base, 1 = topo).
float beam(float i, float y) {
  // Maioria escura, poucas colunas bem claras (como no React Bits).
  float base = 0.12 + 0.88 * pow(hash(i * 3.7 + 1.3), 1.25);
  float breathe = 0.78 + 0.22 * sin(uTime * (0.35 + 0.4 * hash(i * 5.1)) + i * 2.4);

  // Gradiente vertical suave; frequencia, fase e sentido proprios por coluna.
  float f = 0.45 + 0.5 * hash(i * 9.3 + 2.0);
  float dir = hash(i * 7.7 + 0.5) > 0.5 ? 1.0 : -1.0;
  float ph = hash(i * 2.9 + 6.0) + dir * uTime * 0.04;
  float g = 0.5 + 0.5 * sin(TAU * (y * f + ph));
  g = g * g * (3.0 - 2.0 * g);

  return base * breathe * mix(0.3, 1.0, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // A vinheta fica presa a viewport: so as colunas acompanham a paralaxe.
  float r = length(p * vec2(0.75, 0.55));

  // Rotacao (0 = colunas verticais).
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 q = vec2(p.x * ca + p.y * sa, p.y * ca - p.x * sa);

  // Largura visivel em unidades de coluna: telas estreitas mostram menos colunas.
  float viewW = clamp(aspect, 0.6, 1.8) * 1.25;
  float x = q.x * (viewW / aspect) + uPointer.x * 0.05 + 1.7;
  float y = q.y + 0.5 + uScroll * 0.15 + uPointer.y * 0.02;

  // Periodo = soma das larguras; a coluna do pixel e achada pelas bordas acumuladas.
  float period = 0.0;
  for (int k = 0; k < BEAMS; k++) period += beamWidth(float(k));
  float xw = mod(x, period);

  float x0 = 0.0;
  float w = 0.0;
  float idx = 0.0;
  float acc = 0.0;
  for (int k = 0; k < BEAMS; k++) {
    float wk = beamWidth(float(k));
    if (xw >= acc && xw < acc + wk) {
      idx = float(k);
      x0 = acc;
      w = wk;
    }
    acc += wk;
  }

  // Borda nitida, so com anti-alias: mistura 50/50 com a vizinha exatamente na emenda.
  float dl = xw - x0;
  float dr = x0 + w - xw;
  float prev = mod(idx + NBEAMS - 1.0, NBEAMS);
  float next = mod(idx + 1.0, NBEAMS);
  float v = beam(idx, y);
  v = mix(v, beam(prev, y), 0.5 * (1.0 - smoothstep(0.0, EDGE, dl)));
  v = mix(v, beam(next, y), 0.5 * (1.0 - smoothstep(0.0, EDGE, dr)));

  // Leve luz lateral dentro de cada coluna.
  float u = dl / w;
  float lit = hash(idx * 4.1 + 0.3) > 0.5 ? u : 1.0 - u;
  v *= 0.86 + 0.14 * lit;

  // Vinheta: o brilho concentra no centro e morre nas bordas.
  v *= smoothstep(1.7, 0.35, r);

  // Grao de filme (~8 quadros/s), mais visivel dentro das colunas.
  float n = hash2(gl_FragCoord.xy + floor(uTime * 8.0) * 17.0);
  v *= 1.0 + (n - 0.5) * uGrain * (0.4 + v);

  // Efeito terno: colunas pares em vermelho discreto, impares em branco ainda
  // mais discreto (NBEAMS e par, entao a alternancia fecha no loop).
  float isRed = 1.0 - mod(idx, 2.0);
  float gain = mix(WHITE_GAIN, RED_GAIN, isRed);
  vec3 tint = mix(uColor, uAccent, isRed);
  float a = clamp(v * uIntensity * gain, 0.0, 1.0);

  // Saida pre-multiplicada (contexto criado com premultipliedAlpha).
  gl_FragColor = vec4(tint * a, a);
}`;

// Degraus de qualidade aplicados sobre o DPR base.
const QUALITY_STEPS = [1, 0.8, 0.65, 0.5];
const SLOW_FRAME_MS = 24;
const WARMUP_FRAMES = 30;
const SLOW_FRAMES_TO_DOWNGRADE = 40;
const START_TIME = 14;
// Velocidade (escala 0-10) -> unidades de tempo do shader por segundo.
const SPEED_TO_TIME = 0.5;
// Quanto tempo a animacao segue "ativa" apos o ultimo evento de mouse/scroll/toque.
const ACTIVE_HOLD_MS = 160;
// Constantes de tempo (s) da rampa de velocidade: sobe rapido, desce um pouco mais devagar.
const ATTACK_S = 0.18;
const RELEASE_S = 0.35;

export default function BeamsCanvas({
  color = [0.94, 0.92, 0.89],
  accent = [0.5, 0.1, 0.09],
  angle = 0,
  intensity = 0.85,
  grain = 0,
  speed = 10,
  idleSpeed = 0,
  onReady,
  className,
}: BeamsCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [epoch, setEpoch] = useState(0);

  // Props "vivas": alterar cor/velocidade nao recria o contexto WebGL.
  const propsRef = useRef({ color, accent, angle, intensity, grain, speed, idleSpeed, onReady });
  propsRef.current = { color, accent, angle, intensity, grain, speed, idleSpeed, onReady };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // Sem WebGL: o fundo CSS estatico permanece.
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.cssText = "display:block;width:100%;height:100%";
    container.appendChild(gl.canvas);

    const initial = propsRef.current;
    const program = new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: START_TIME },
        uRes: { value: [1, 1] },
        uColor: { value: initial.color },
        uAccent: { value: initial.accent },
        uPointer: { value: [0, 0] },
        uScroll: { value: 0 },
        uAngle: { value: initial.angle },
        uIntensity: { value: initial.intensity },
        uGrain: { value: initial.grain },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const baseDpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.5);
    let qualityStep = 0;
    let time = START_TIME;
    let ready = false;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let scroll = 0;
    let scrollTarget = 0;

    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (!w || !h) return;
      renderer.dpr = baseDpr * QUALITY_STEPS[qualityStep];
      renderer.setSize(w, h);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
    }

    function draw() {
      const p = propsRef.current;
      program.uniforms.uTime.value = time;
      program.uniforms.uColor.value = p.color;
      program.uniforms.uAccent.value = p.accent;
      program.uniforms.uAngle.value = p.angle;
      program.uniforms.uIntensity.value = p.intensity;
      program.uniforms.uGrain.value = p.grain;
      program.uniforms.uPointer.value = [pointer.x, pointer.y];
      program.uniforms.uScroll.value = scroll;
      renderer.render({ scene: mesh });
      if (!ready) {
        ready = true;
        p.onReady?.();
      }
    }

    // --- Movimento reduzido: um frame estatico, redesenhado so no resize. ---
    if (shouldReduceMotion) {
      resize();
      draw();
      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(container);
      return () => {
        ro.disconnect();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      };
    }

    // --- Loop animado: so roda enquanto ha interacao (ou a rampa ainda assenta). ---
    let frameId = 0;
    let running = false;
    let last = 0;
    let frames = 0;
    let slowFrames = 0;
    let activeUntil = 0;
    let speedCur = propsRef.current.idleSpeed;

    function tick(now: number) {
      frameId = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      const frameMs = now - last;
      last = now;

      // Mouse/scroll/toque => velocidade `speed`; sem movimento => `idleSpeed` (0).
      const p = propsRef.current;
      const active = now < activeUntil;
      const target = active ? p.speed : p.idleSpeed;
      speedCur += (target - speedCur) * (1 - Math.exp(-dt / (target > speedCur ? ATTACK_S : RELEASE_S)));

      time += dt * speedCur * SPEED_TO_TIME;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      scroll += (scrollTarget - scroll) * 0.1;
      draw();

      // Em repouso nao ha nada a animar: o loop para e a GPU descansa.
      const settled =
        Math.abs(pointer.tx - pointer.x) < 5e-4 &&
        Math.abs(pointer.ty - pointer.y) < 5e-4 &&
        Math.abs(scrollTarget - scroll) < 5e-4;
      if (!active && p.idleSpeed === 0 && speedCur < 0.01 && settled) {
        stop();
        return;
      }

      // Qualidade adaptativa: so desce (evita oscilar), apos o aquecimento.
      frames += 1;
      if (frames > WARMUP_FRAMES && qualityStep < QUALITY_STEPS.length - 1) {
        slowFrames = frameMs > SLOW_FRAME_MS ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        if (slowFrames > SLOW_FRAMES_TO_DOWNGRADE) {
          qualityStep += 1;
          slowFrames = 0;
          resize();
        }
      }
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      frameId = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(frameId);
    }

    let inView = false;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    io.observe(container);

    const onVisibility = () => (document.hidden || !inView ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Parado, o canvas limpo pelo resize precisa de um redesenho imediato.
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(container);

    // Qualquer interacao marca a animacao como ativa e acorda o loop.
    const poke = () => {
      activeUntil = performance.now() + ACTIVE_HOLD_MS;
      if (inView && !document.hidden) start();
    };

    // Fundo fixo: a rolagem da pagina inteira vira deriva continua das colunas.
    const onScroll = () => {
      scrollTarget = window.scrollY / (window.innerHeight || 1);
      poke();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    scrollTarget = window.scrollY / (window.innerHeight || 1);
    scroll = scrollTarget;

    // Paralaxe do ponteiro apenas com mouse; toque so acorda a animacao (scroll mobile).
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      }
      poke();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("wheel", poke, { passive: true });
    window.addEventListener("touchmove", poke, { passive: true });

    // Mobile derruba o contexto WebGL em segundo plano: recria ao voltar.
    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const onContextRestored = () => setEpoch((n) => n + 1);
    gl.canvas.addEventListener("webglcontextlost", onContextLost);
    gl.canvas.addEventListener("webglcontextrestored", onContextRestored);

    resize();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("wheel", poke);
      window.removeEventListener("touchmove", poke);
      gl.canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
    };
  }, [shouldReduceMotion, epoch]);

  return <div ref={containerRef} aria-hidden="true" className={className} />;
}
