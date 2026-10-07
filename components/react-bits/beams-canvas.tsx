"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { useReducedMotion } from "motion/react";
import { LOGO_ASPECT, buildLogoSvg } from "@/lib/techtie-logo";
import { fragment, vertex } from "./beams-shader";

/**
 * Beams (React Bits, reescrito) — colunas verticais de luz com bordas nitidas.
 * O original usa three.js + react-three-fiber (centenas de KB, geometria 3D);
 * aqui sao colunas analiticas num unico fragment shader (ogl, ~30 KB): cada
 * coluna tem largura e nivel de brilho proprios e um gradiente vertical suave
 * que se desloca com o tempo.
 *
 * Velocidade: o tempo das colunas so corre quando o usuario interage (mouse, roda,
 * scroll ou toque); em repouso e `idleSpeed` (0).
 *
 * Cena do hero (`hero`): sobre as colunas, o shader desenha a logo dourada (textura
 * gerada por lib/techtie-logo.ts) e circuitos com pulsos de luz. A arte fica presa ao documento (rola com a pagina) e se
 * ancora nos elementos HTML marcados com `data-scene-anchor`:
 *   "logo"            caixa onde a logo e desenhada (proporcao 4:5);
 *   "card-0|1|2"      cartoes da coluna da direita do grupo a esquerda da logo (os
 *                     circuitos terminam no lado direito deles);
 *   "hero-end"        rodape do hero (marca o fim da area animada).
 * Sem esses elementos a cena nao e desenhada e sobram so as colunas.
 *
 * Performance:
 * - render pausado fora da viewport, com a aba oculta e em repouso (rAF cancelado);
 * - com o hero visivel o loop segue em ~30 quadros/s (brilho, pulsos, cintilar);
 *   rolado para fora do hero, volta a parar em repouso;
 * - DPR limitado e qualidade adaptativa: se o frame time passar de ~24 ms,
 *   a resolucao interna cai em degraus;
 * - movimento reduzido: frame estatico, redesenhado so no resize e no scroll;
 * - perda de contexto WebGL (comum no mobile) recria o renderer.
 */
export interface BeamsCanvasProps {
  /** Cor das colunas claras, as impares: grafite (rgb 0-1). */
  color?: [number, number, number];
  /** Cor das colunas de acento, as pares: preto (rgb 0-1). */
  accent?: [number, number, number];
  /** Rotacao das colunas em radianos (0 = vertical). */
  angle?: number;
  intensity?: number;
  grain?: number;
  /** Velocidade enquanto ha interacao (escala do React Bits: 10 = maxima). */
  speed?: number;
  /** Velocidade em repouso, sem mouse/scroll/toque. */
  idleSpeed?: number;
  /** Desenha a cena do hero (logo e circuitos) ancorada no HTML. */
  hero?: boolean;
  /** Chamado apos o primeiro frame desenhado (para o fade-in). */
  onReady?: () => void;
  className?: string;
}

interface Anchors {
  /** Centro e meias-dimensoes da logo, em unidades de cena. */
  logo: [number, number, number, number];
  /** Pontos onde os circuitos da esquerda terminam (um por cartao). */
  cards: [number, number][];
  /** Retangulo de cada cartao (centro x, centro y, meia-largura, meia-altura), para contornar a borda. */
  cardRects: [number, number, number, number][];
  cardsOn: boolean;
  /** Posicao do documento (px) a partir da qual o hero saiu da tela. */
  bottom: number;
}

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
// Com o hero visivel e sem interacao, a cena redesenha a ~30 quadros/s.
const AMBIENT_FRAME_MS = 33;
// Folga (em alturas da viewport) entre o no do circuito e a borda do cartao.
const NODE_GAP = 0.028;
// Textura da logo: largura em px (a altura segue a proporcao da logo).
const LOGO_TEX_WIDTH = 1024;

const EMPTY_PIXEL = new Uint8Array([0, 0, 0, 0]);

// A logo e rasterizada uma unica vez e reaproveitada se o contexto WebGL for recriado.
let logoCanvas: Promise<HTMLCanvasElement | null> | null = null;

function loadLogoCanvas() {
  logoCanvas ??= new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = LOGO_TEX_WIDTH;
      canvas.height = Math.round(LOGO_TEX_WIDTH / LOGO_ASPECT);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };
    img.onerror = () => resolve(null);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildLogoSvg())}`;
  });
  return logoCanvas;
}

/** Le a posicao dos elementos-ancora e converte para unidades de cena (altura = 1). */
function readAnchors(): Anchors | null {
  const H = window.innerHeight || 1;
  const W = window.innerWidth || 1;
  const sy = window.scrollY;

  const rectOf = (key: string) => {
    const el = document.querySelector<HTMLElement>(`[data-scene-anchor="${key}"]`);
    const r = el?.getBoundingClientRect();
    return r && r.width > 0 && r.height > 0 ? r : null;
  };
  const toScene = (x: number, y: number): [number, number] => [(x - W / 2) / H, (H / 2 - (y + sy)) / H];

  const logo = rectOf("logo");
  const end = rectOf("hero-end");
  if (!logo || !end) return null;

  const hh = Math.min(logo.height / 2, logo.width / 2 / LOGO_ASPECT) / H;
  const [lx, ly] = toScene(logo.left + logo.width / 2, logo.top + logo.height / 2);

  const cardRects = [0, 1, 2].map((i) => rectOf(`card-${i}`));
  // Os circuitos so existem com os cartoes ao lado da logo (nao empilhados abaixo dela).
  const cardsOn = cardRects.every((r) => r && r.right < logo.left && r.top < logo.bottom);
  const cards = cardRects.map((r) => (r ? toScene(r.right + NODE_GAP * H, r.top + r.height / 2) : ([0, 0] as [number, number])));
  const rects = cardRects.map((r) => {
    if (!r) return [0, 0, 0, 0] as [number, number, number, number];
    const [cx, cy] = toScene(r.left + r.width / 2, r.top + r.height / 2);
    return [cx, cy, (r.width / 2) / H, (r.height / 2) / H] as [number, number, number, number];
  });

  return {
    logo: [lx, ly, hh * LOGO_ASPECT, hh],
    cards,
    cardRects: rects,
    cardsOn,
    bottom: end.bottom + sy + 0.35 * H,
  };
}

export default function BeamsCanvas({
  color = [0.16, 0.16, 0.16],
  accent = [0.0, 0.0, 0.0],
  angle = 0,
  intensity = 0.3,
  grain = 0,
  speed = 10,
  idleSpeed = 0,
  hero = false,
  onReady,
  className,
}: BeamsCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [epoch, setEpoch] = useState(0);

  // Props "vivas": alterar cor/velocidade nao recria o contexto WebGL.
  const propsRef = useRef({ color, accent, angle, intensity, grain, speed, idleSpeed, hero, onReady });
  propsRef.current = { color, accent, angle, intensity, grain, speed, idleSpeed, hero, onReady };

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

    // Textura da logo (premultiplicada, sem mipmaps): comeca vazia e recebe a imagem
    // quando a rasterizacao termina.
    const logoTexture = new Texture(gl, {
      image: EMPTY_PIXEL,
      width: 1,
      height: 1,
      generateMipmaps: false,
      premultiplyAlpha: true,
    });

    const initial = propsRef.current;
    const program = new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: START_TIME },
        uClock: { value: 0 },
        uRes: { value: [1, 1] },
        uColor: { value: initial.color },
        uAccent: { value: initial.accent },
        uPointer: { value: [0, 0] },
        uScroll: { value: 0 },
        uScrollY: { value: 0 },
        uAngle: { value: initial.angle },
        uIntensity: { value: initial.intensity },
        uGrain: { value: initial.grain },
        uHero: { value: 0 },
        uLogoTex: { value: logoTexture },
        uLogoReady: { value: 0 },
        uLogo: { value: [0, 0, 0.2, 0.25] },
        uCard0: { value: [0, 0] },
        uCard1: { value: [0, 0] },
        uCard2: { value: [0, 0] },
        uCard0Rect: { value: [0, 0, 0, 0] },
        uCard1Rect: { value: [0, 0, 0, 0] },
        uCard2Rect: { value: [0, 0, 0, 0] },
        uCardsOn: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const baseDpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2);
    let qualityStep = 0;
    let time = START_TIME;
    let clock = 0;
    let ready = false;
    let disposed = false;
    let anchors: Anchors | null = null;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let scroll = 0;
    let scrollTarget = 0;

    // Ancoras = posicao dos elementos HTML a que a arte do hero se prende.
    function refreshAnchors() {
      anchors = propsRef.current.hero ? readAnchors() : null;
    }

    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (!w || !h) return;
      renderer.dpr = baseDpr * QUALITY_STEPS[qualityStep];
      renderer.setSize(w, h);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      refreshAnchors();
    }

    function draw() {
      const p = propsRef.current;
      const u = program.uniforms;
      u.uTime.value = time;
      u.uClock.value = clock;
      u.uColor.value = p.color;
      u.uAccent.value = p.accent;
      u.uAngle.value = p.angle;
      u.uIntensity.value = p.intensity;
      u.uGrain.value = p.grain;
      u.uPointer.value = [pointer.x, pointer.y];
      u.uScroll.value = scroll;

      // A arte do hero e presa ao documento: usa o scroll bruto, sem suavizar.
      u.uScrollY.value = window.scrollY / (window.innerHeight || 1);
      if (anchors) {
        u.uHero.value = 1;
        u.uLogo.value = anchors.logo;
        u.uCard0.value = anchors.cards[0];
        u.uCard1.value = anchors.cards[1];
        u.uCard2.value = anchors.cards[2];
        u.uCard0Rect.value = anchors.cardRects[0];
        u.uCard1Rect.value = anchors.cardRects[1];
        u.uCard2Rect.value = anchors.cardRects[2];
        u.uCardsOn.value = anchors.cardsOn ? 1 : 0;
      } else {
        u.uHero.value = 0;
      }

      renderer.render({ scene: mesh });
      if (!ready) {
        ready = true;
        p.onReady?.();
      }
    }

    // Logo pronta: sobe a textura e redesenha (mesmo com o loop parado).
    let redraw = () => draw();
    loadLogoCanvas().then((canvas) => {
      if (disposed || !canvas) return;
      logoTexture.image = canvas;
      logoTexture.needsUpdate = true;
      program.uniforms.uLogoReady.value = 1;
      redraw();
    });

    // Ancoras: mudam com o layout (resize, fontes, quebra de texto), nao com o scroll.
    const anchorEls = () => Array.from(document.querySelectorAll("[data-scene-anchor]"));
    const anchorObserver = new ResizeObserver(() => {
      refreshAnchors();
      redraw();
    });
    anchorEls().forEach((el) => anchorObserver.observe(el));
    const onWindowResize = () => {
      refreshAnchors();
      redraw();
    };
    window.addEventListener("resize", onWindowResize);
    document.fonts?.ready.then(onWindowResize);

    // --- Movimento reduzido: frame estatico, redesenhado no resize e no scroll. ---
    if (shouldReduceMotion) {
      resize();
      draw();
      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(container);

      let pending = false;
      const onStaticScroll = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          draw();
        });
      };
      window.addEventListener("scroll", onStaticScroll, { passive: true });

      return () => {
        disposed = true;
        ro.disconnect();
        anchorObserver.disconnect();
        window.removeEventListener("resize", onWindowResize);
        window.removeEventListener("scroll", onStaticScroll);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      };
    }

    // --- Loop animado: roda com interacao, com o hero visivel ou enquanto a rampa assenta. ---
    let frameId = 0;
    let running = false;
    let last = 0;
    let lastDraw = 0;
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
      clock += dt;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      scroll += (scrollTarget - scroll) * 0.1;

      // Hero na tela: a cena segue viva, mas sem interacao basta ~30 quadros/s.
      const ambient = anchors !== null && window.scrollY < anchors.bottom;
      if (active || !ambient || now - lastDraw >= AMBIENT_FRAME_MS) {
        lastDraw = now;
        draw();
      }

      // Em repouso, fora do hero, nao ha nada a animar: o loop para e a GPU descansa.
      const settled =
        Math.abs(pointer.tx - pointer.x) < 5e-4 &&
        Math.abs(pointer.ty - pointer.y) < 5e-4 &&
        Math.abs(scrollTarget - scroll) < 5e-4;
      if (!active && !ambient && p.idleSpeed === 0 && speedCur < 0.01 && settled) {
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
    redraw = () => {
      if (!running) draw();
    };
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
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      anchorObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onWindowResize);
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
