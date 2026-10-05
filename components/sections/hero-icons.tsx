// Ilustracoes dos cartoes do hero (decorativas): uma por solucao, em ouro, prata e
// bronze sobre o vidro escuro. Sem texto, aria-hidden. Os degrades vem de <IconDefs />,
// renderizado uma unica vez no hero.

import type { ReactNode } from "react";

export function IconDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hi-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe9a6" />
          <stop offset="1" stopColor="#c8963a" />
        </linearGradient>
        <linearGradient id="hi-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8963a" />
          <stop offset="1" stopColor="#7a5518" />
        </linearGradient>
        <linearGradient id="hi-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f1ea" />
          <stop offset="1" stopColor="#8d8a84" />
        </linearGradient>
        <linearGradient id="hi-bronze" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0a470" />
          <stop offset="1" stopColor="#7c4a26" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const GOLD = "url(#hi-gold)";
const EDGE = "url(#hi-edge)";
const LINE = "#f3d57a";
// Tracos retos (bbox sem largura/altura) nao aceitam degrade: usam cor solida.
const SOLID = "#e6bb58";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 48" className="h-full w-full" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** Engrenagem: dentes como um poligono, miolo vazado. */
function gearPath(cx: number, cy: number, outer: number, inner: number, teeth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    for (const [da, r] of [
      [-0.28, inner],
      [-0.16, outer],
      [0.16, outer],
      [0.28, inner],
    ] as const) {
      const t = a + da * step * 2;
      pts.push(`${(cx + Math.cos(t) * r).toFixed(1)},${(cy + Math.sin(t) * r).toFixed(1)}`);
    }
  }
  return `M${pts.join("L")}Z`;
}

/** CRM: um contato central ligado a outros dois (carteira de clientes). */
export function CrmIcon() {
  return (
    <Frame>
      <path d="M13 24 L32 18 L51 24" fill="none" stroke={LINE} strokeOpacity=".5" strokeWidth="1" />
      <circle cx="12" cy="24" r="4.2" fill="url(#hi-silver)" />
      <path d="M4 40 C4 32 8 30 12 30 C16 30 20 32 20 40 Z" fill="url(#hi-silver)" />
      <circle cx="52" cy="24" r="4.2" fill="url(#hi-bronze)" />
      <path d="M44 40 C44 32 48 30 52 30 C56 30 60 32 60 40 Z" fill="url(#hi-bronze)" />
      <circle cx="32" cy="14" r="7.5" fill={GOLD} />
      <path d="M18 42 C18 30 25 26 32 26 C39 26 46 30 46 42 Z" fill={GOLD} />
    </Frame>
  );
}

/** Enriquecimento de dados: base de dados recebendo novas informacoes. */
export function DataEnrichIcon() {
  return (
    <Frame>
      <path d="M12 12 V36 C12 40.5 19 44 28 44 C37 44 44 40.5 44 36 V12 Z" fill={EDGE} />
      <path d="M12 20 C12 24.5 19 28 28 28 C37 28 44 24.5 44 20" fill="none" stroke="#2a1d0a" strokeOpacity=".65" strokeWidth="1.2" />
      <path d="M12 28 C12 32.5 19 36 28 36 C37 36 44 32.5 44 28" fill="none" stroke="#2a1d0a" strokeOpacity=".65" strokeWidth="1.2" />
      <ellipse cx="28" cy="12" rx="16" ry="6" fill={GOLD} />
      <ellipse cx="28" cy="12" rx="10" ry="3.2" fill="none" stroke="#7a5518" strokeOpacity=".5" strokeWidth=".8" />
      {/* Faiscas: dados novos entrando */}
      <path d="M52 3 L54.2 9.4 L60.6 11.6 L54.2 13.8 L52 20.2 L49.8 13.8 L43.4 11.6 L49.8 9.4 Z" fill="#fbe9a6" />
      <path d="M53 27 L54.2 30.8 L58 32 L54.2 33.2 L53 37 L51.8 33.2 L48 32 L51.8 30.8 Z" fill={LINE} fillOpacity=".8" />
    </Frame>
  );
}

/** Sites e landing pages: janela de navegador com layout de blocos. */
export function ScalesIcon() {
  return (
    <Frame>
      <rect x="6" y="8" width="52" height="36" rx="4" fill={EDGE} />
      <rect x="6" y="8" width="52" height="9" rx="4" fill="url(#hi-silver)" />
      <circle cx="12" cy="12.5" r="1.6" fill="#1d150a" />
      <circle cx="17" cy="12.5" r="1.6" fill="#1d150a" />
      <circle cx="22" cy="12.5" r="1.6" fill="#1d150a" />
      <rect x="11" y="22" width="16" height="16" rx="2" fill={GOLD} />
      <rect x="31" y="22" width="22" height="7" rx="1.5" fill="url(#hi-silver)" />
      <rect x="31" y="31" width="22" height="3.4" rx="1.5" fill={LINE} fillOpacity=".7" />
      <rect x="31" y="36.5" width="16" height="3.4" rx="1.5" fill={LINE} fillOpacity=".45" />
    </Frame>
  );
}

/** Gestao operacional: engrenagens encaixadas. */
export function GearsIcon() {
  return (
    <Frame>
      <path d={gearPath(23, 28, 16, 12.5, 9)} fill={GOLD} fillRule="evenodd" />
      <circle cx="23" cy="28" r="5.2" fill="#17110a" />
      <circle cx="23" cy="28" r="5.2" fill="none" stroke="#7a5518" strokeWidth="1" />
      <path d="M48 17 L46 20" stroke="none" />
      <path d={gearPath(47, 15, 10.5, 8, 7)} fill="url(#hi-silver)" />
      <circle cx="47" cy="15" r="3.3" fill="#17110a" />
    </Frame>
  );
}

/** Dashboards de inteligencia (BI): barras crescentes e um grafico em rosca. */
export function DashboardIcon() {
  return (
    <Frame>
      {[
        { x: 5, h: 12 },
        { x: 14, h: 20 },
        { x: 23, h: 16 },
        { x: 32, h: 28 },
      ].map((b) => (
        <rect key={b.x} x={b.x} y={44 - b.h} width="6.5" height={b.h} rx="1.5" fill={GOLD} />
      ))}
      <path d="M6 28 L16 20 L26 24 L36 10" fill="none" stroke="#fff3c0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="49" cy="18" r="9.5" fill="none" stroke="#5d3f10" strokeWidth="5" />
      <path d="M49 8.5 A9.5 9.5 0 1 1 40.4 22" fill="none" stroke={LINE} strokeWidth="5" />
      <path d="M40.4 22 A9.5 9.5 0 0 1 49 8.5" fill="none" stroke="url(#hi-silver)" strokeWidth="5" />
    </Frame>
  );
}

/** Automacoes e integracoes com WhatsApp: balao de conversa com raio de automacao. */
export function ChatBoltIcon() {
  return (
    <Frame>
      <path d="M10 6 H44 A6 6 0 0 1 50 12 V30 A6 6 0 0 1 44 36 H24 L13 44 V36 H10 A6 6 0 0 1 4 30 V12 A6 6 0 0 1 10 6 Z" fill={EDGE} />
      <path d="M10 8 H44 A4 4 0 0 1 48 12 V30 A4 4 0 0 1 44 34 H22.5 L15 39.5 V34 H10 A4 4 0 0 1 6 30 V12 A4 4 0 0 1 10 8 Z" fill="#1d150a" />
      <path d="M29 11 L19 23 H26 L23.5 31 L34 18.5 H27 Z" fill={GOLD} />
      {/* resposta automatica */}
      <path d="M44 32 H54 A5 5 0 0 1 59 37 V40 A5 5 0 0 1 54 45 H52 V47 L49 45 H44 A5 5 0 0 1 39 40 V37 A5 5 0 0 1 44 32 Z" fill="url(#hi-silver)" />
      <path d="M43.5 38.5 L45.8 41 L50 36.5 M49.5 41.5 L51.2 43.2 L55 39.5" fill="none" stroke="#5a4a2a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}
