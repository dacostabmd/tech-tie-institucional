"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { useReducedMotion } from "motion/react";
import { LOGO_ASPECT, buildLogoSvg } from "@/lib/techtie-logo";
import { fragment, vertex } from "./beams-shader";

/**
 * Cena do hero (React Bits "Beams", reescrito): logo dourada (textura gerada por
 * lib/techtie-logo.ts) com brilho metalico e circuitos com pulsos de luz, desenhados
 * num unico fragment shader (ogl, ~30 KB) sobre fundo transparente — o fundo visual
 * vem do Grainient, por baixo deste canvas.
 *
 * A arte fica presa ao documento (rola com a pagina) e se ancora nos elementos HTML
 * marcados com `data-scene-anchor`:
 *   "logo"            caixa onde a logo e desenhada (proporcao 4:5);
 *   "card-0|1|2"      cartoes da coluna da direita do grupo a esquerda da logo (os
 *                     circuitos terminam no lado direito deles);
 *   "hero-end"        rodape do hero (marca o fim da area animada).
 * Sem esses elementos a cena nao e desenhada.
 *
 * Performance:
 * - render pausado fora da viewport, com a aba oculta e (fora do hero) em repouso;
 * - com o hero visivel o loop segue em ~30 quadros/s (brilho, pulsos, cintilar);
 * - movimento reduzido: frame estatico, redesenhado so no resize e no scroll;
 * - perda de contexto WebGL (comum no mobile) recria o renderer.
 */
export interface BeamsCanvasProps {
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

// Com o hero visivel, a cena redesenha a ~30 quadros/s.
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

export default function BeamsCanvas({ hero = false, onReady, className }: BeamsCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [epoch, setEpoch] = useState(0);

  // Props "vivas": alterar hero/onReady nao recria o contexto WebGL.
  const propsRef = useRef({ hero, onReady });
  propsRef.current = { hero, onReady };

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
      return; // Sem WebGL: nada e desenhado.
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

    const program = new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uClock: { value: 0 },
        uRes: { value: [1, 1] },
        uPointer: { value: [0, 0] },
        uScrollY: { value: 0 },
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
    let clock = 0;
    let ready = false;
    let disposed = false;
    let anchors: Anchors | null = null;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    // Ancoras = posicao dos elementos HTML a que a arte do hero se prende.
    function refreshAnchors() {
      anchors = propsRef.current.hero ? readAnchors() : null;
    }

    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (!w || !h) return;
      renderer.dpr = baseDpr;
      renderer.setSize(w, h);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      refreshAnchors();
    }

    function draw() {
      const p = propsRef.current;
      const u = program.uniforms;
      u.uClock.value = clock;
      u.uPointer.value = [pointer.x, pointer.y];

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

    // --- Loop animado: roda com o hero visivel, pausa fora dele. ---
    let frameId = 0;
    let running = false;
    let last = 0;
    let lastDraw = 0;

    function tick(now: number) {
      frameId = requestAnimationFrame(tick);

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      clock += dt;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      // Hero na tela: a cena segue viva a ~30 quadros/s; fora dele nao ha nada a animar.
      const ambient = anchors !== null && window.scrollY < anchors.bottom;
      if (!ambient) {
        stop();
        return;
      }
      if (now - lastDraw >= AMBIENT_FRAME_MS) {
        lastDraw = now;
        refreshAnchors();
        draw();
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

    // Qualquer interacao acorda o loop (scroll pode entrar/sair da janela "ambient").
    const poke = () => {
      if (inView && !document.hidden) start();
    };

    const onScroll = () => poke();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Paralaxe do ponteiro apenas com mouse (acompanha o brilho da logo); toque so acorda.
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      }
      poke();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Mobile derruba o contexto WebGL em segundo plano: recria ao voltar.
    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const onContextRestored = () => setEpoch((n) => n + 1);
    gl.canvas.addEventListener("webglcontextlost", onContextLost);
    gl.canvas.addEventListener("webglcontextrestored", onContextRestored);

    resize();
    poke();

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
      gl.canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
    };
  }, [shouldReduceMotion, epoch]);

  return <div ref={containerRef} aria-hidden="true" className={className} />;
}
