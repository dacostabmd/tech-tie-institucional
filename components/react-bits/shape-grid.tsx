"use client";

import { useEffect, useRef } from "react";

/**
 * Shape Grid / Squares (React Bits, adaptado) — grade quadriculada em Canvas 2D
 * que desliza lentamente, como papel milimetrado. Adaptacoes: apenas o
 * formato quadrado, suporte a devicePixelRatio (linhas nitidas) e cor de
 * vinheta configuravel para funcionar sobre fundo claro.
 */
interface ShapeGridProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  vignetteColor?: string;
  className?: string;
}

export default function ShapeGrid({
  direction = "diagonal",
  speed = 0.2,
  borderColor = "rgba(0,0,0,0.08)",
  squareSize = 48,
  hoverFillColor = "rgba(0,0,0,0.04)",
  vignetteColor = "#ffffff",
  className,
}: ShapeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Gradientes de canvas interpolam sem pre-multiplicar alfa: partir de
    // preto transparente "suja" a vinheta sobre fundo claro. Usa a propria
    // cor da vinheta com alfa 0 como ponto inicial.
    ctx.fillStyle = vignetteColor;
    const normalized = String(ctx.fillStyle);
    const vignetteStart = /^#[0-9a-f]{6}$/i.test(normalized)
      ? `rgba(${parseInt(normalized.slice(1, 3), 16)}, ${parseInt(normalized.slice(3, 5), 16)}, ${parseInt(normalized.slice(5, 7), 16)}, 0)`
      : "rgba(0, 0, 0, 0)";

    const offset = { x: 0, y: 0 };
    let hovered: { x: number; y: number } | null = null;
    let width = 0;
    let height = 0;
    let frameId: number | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const ox = ((offset.x % squareSize) + squareSize) % squareSize;
      const oy = ((offset.y % squareSize) + squareSize) % squareSize;
      const cols = Math.ceil(width / squareSize) + 2;
      const rows = Math.ceil(height / squareSize) + 2;

      ctx.lineWidth = 1;
      ctx.strokeStyle = borderColor;
      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const sx = col * squareSize + ox;
          const sy = row * squareSize + oy;
          if (hovered && hovered.x === col && hovered.y === row) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(sx, sy, squareSize, squareSize);
          }
          ctx.strokeRect(sx + 0.5, sy + 0.5, squareSize, squareSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.sqrt(width ** 2 + height ** 2) / 2,
      );
      gradient.addColorStop(0, vignetteStart);
      gradient.addColorStop(1, vignetteColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const tick = () => {
      const s = Math.max(speed, 0.05);
      if (direction === "right" || direction === "diagonal") offset.x -= s;
      if (direction === "left") offset.x += s;
      if (direction === "down" || direction === "diagonal") offset.y -= s;
      if (direction === "up") offset.y += s;
      offset.x %= squareSize;
      offset.y %= squareSize;
      draw();
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameId === null) frameId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const ox = ((offset.x % squareSize) + squareSize) % squareSize;
      const oy = ((offset.y % squareSize) + squareSize) % squareSize;
      hovered = {
        x: Math.floor((event.clientX - rect.left - ox) / squareSize),
        y: Math.floor((event.clientY - rect.top - oy) / squareSize),
      };
    };
    const handleMouseLeave = () => {
      hovered = null;
    };

    let inView = false;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden || !inView ? stop() : start());

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    resize();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, vignetteColor]);

  return <canvas ref={canvasRef} className={`block size-full ${className ?? ""}`} />;
}
