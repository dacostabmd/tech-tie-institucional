"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

// Converte atraso em style inline para escalonar a animacao entre elementos.
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/**
 * Envelope do cabecalho do card.
 *
 * data-play="false" pausa as animacoes CSS quando o card sai da viewport
 * (IntersectionObserver com threshold 0.1), poupando GPU/bateria.
 */
function Hd({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setPlay(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="hd" data-play={play ? "true" : "false"}>
      {children}
    </div>
  );
}

function Label({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="hd-label">
      {title}
      <span className="hd-opt">
        <span className="hd-dim">·</span>
        {children}
      </span>
    </div>
  );
}

// Milhar com ponto, deterministico (igual no servidor e no cliente).
const formatCount = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Contador do BI: sobe de 0 ao valor a cada 5s (valor final no SSR e sem animacao). */
function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const run = () => {
      if (el.closest(".hd")?.getAttribute("data-play") === "false") return;
      cancelAnimationFrame(raf);
      let start: number | null = null;
      const frame = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / 1600, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatCount(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    run();
    const id = window.setInterval(run, 5000);
    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return <span ref={ref}>{formatCount(target)}</span>;
}

/** CRM · rede de conexoes + palavra rotativa. */
export function HeaderGestao() {
  return (
    <Hd>
      <Label title="CRM">
        <span className="hd-rw hd-sub" aria-hidden="true">
          <span>clientes</span>
          <span style={delay(2)}>prazos</span>
          <span style={delay(4)}>tarefas</span>
          <span style={delay(6)}>negócios</span>
        </span>
      </Label>
      <div className="hd-stage" aria-hidden="true">
        <svg className="hd-full" viewBox="0 0 190 76" preserveAspectRatio="xMidYMid meet" focusable="false">
          <line className="hd-ln" x1="95" y1="38" x2="30" y2="18" style={delay(0.1)} />
          <line className="hd-ln" x1="95" y1="38" x2="160" y2="16" style={delay(0.3)} />
          <line className="hd-ln" x1="95" y1="38" x2="38" y2="60" style={delay(0.5)} />
          <line className="hd-ln" x1="95" y1="38" x2="155" y2="58" style={delay(0.7)} />
          <circle cx="95" cy="38" r="8" fill="var(--hd-accent-bg)" stroke="var(--hd-accent)" strokeWidth="1" />
          <circle className="hd-nd" cx="30" cy="18" r="4" fill="var(--hd-accent)" style={delay(0.45)} />
          <circle className="hd-nd" cx="160" cy="16" r="4" fill="var(--hd-accent)" style={delay(0.65)} />
          <circle className="hd-nd" cx="38" cy="60" r="4" fill="var(--hd-accent)" style={delay(0.85)} />
          <circle className="hd-nd" cx="155" cy="58" r="4" fill="var(--hd-accent)" style={delay(1.05)} />
        </svg>
      </div>
    </Hd>
  );
}

/** Automação · evento disparando integrações + ponto "ao vivo". */
export function HeaderTribunais() {
  return (
    <Hd>
      <Label title="Automação">
        <span className="hd-dot" aria-hidden="true" />
        <span className="hd-sub">integrações ativas</span>
      </Label>
      <div className="hd-stage hd-flex" aria-hidden="true">
        <div className="hd-cnj">
          <span>novo lead</span>
        </div>
        <div className="hd-chips">
          <span>CRM</span>
          <span style={delay(0.25)}>WhatsApp</span>
          <span style={delay(0.5)}>E-mail</span>
          <span style={delay(0.75)}>API</span>
        </div>
      </div>
    </Hd>
  );
}

/** BI · barras + linha de tendencia + contador. */
export function HeaderBi() {
  const bars = [
    { x: 24, y: 50, h: 18, d: 0.05 },
    { x: 54, y: 40, h: 28, d: 0.15 },
    { x: 84, y: 46, h: 22, d: 0.25 },
    { x: 114, y: 28, h: 40, d: 0.35 },
    { x: 144, y: 14, h: 54, d: 0.45 },
  ];

  return (
    <Hd>
      <Label title="BI">
        <span className="hd-sub" aria-hidden="true">
          <Counter target={1248} /> registros
        </span>
      </Label>
      <div className="hd-stage" aria-hidden="true">
        <svg className="hd-full" viewBox="0 0 190 76" preserveAspectRatio="xMidYMid meet" focusable="false">
          {bars.map((b) => (
            <rect
              key={b.x}
              className="hd-bar"
              x={b.x}
              y={b.y}
              width="22"
              height={b.h}
              rx="2"
              fill="var(--hd-accent-bg)"
              stroke="var(--hd-accent)"
              style={delay(b.d)}
            />
          ))}
          <polyline
            className="hd-tr"
            points="35,50 65,40 95,46 125,28 155,14"
            fill="none"
            stroke="var(--hd-accent)"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </Hd>
  );
}

/** BI · rosca + barras de progresso e seletor deslizante (area/tribunal/fase). */
export function HeaderIndicadores() {
  const arc = (l: number, offset: number, stroke: string, d?: number) => (
    <circle
      className="hd-ar"
      cx="30"
      cy="30"
      r="18"
      pathLength={100}
      stroke={stroke}
      strokeDashoffset={offset}
      style={{ "--l": l, ...(d ? delay(d) : {}) } as CSSProperties}
    />
  );

  return (
    <Hd>
      <Label title="BI">
        <span className="hd-seg" aria-hidden="true">
          <i />
          <span>área</span>
          <span>canal</span>
          <span>etapa</span>
        </span>
      </Label>
      <div className="hd-stage hd-flex hd-gap" aria-hidden="true">
        <svg width="52" height="52" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
          <circle cx="30" cy="30" r="18" fill="none" stroke="var(--hd-track)" strokeWidth="8" />
          <g transform="rotate(-90 30 30)">
            {arc(44, 0, "var(--hd-accent)")}
            {arc(29, -45, "var(--hd-border-strong)", 0.15)}
            {arc(24, -75, "var(--hd-danger)", 0.3)}
          </g>
        </svg>
        <div className="hd-bars">
          <div className="hd-tk">
            <i className="hd-bx" style={{ width: "55%" }} />
          </div>
          <div className="hd-tk">
            <i className="hd-bx hd-bx--r" style={{ width: "88%", ...delay(0.1) }} />
          </div>
          <div className="hd-tk">
            <i className="hd-bx" style={{ width: "38%", ...delay(0.2) }} />
          </div>
        </div>
      </div>
    </Hd>
  );
}

/** IA · triagem de movimentacoes com tags de risco e "classificando...". */
export function HeaderRisco() {
  return (
    <Hd>
      <Label title="IA">
        <span className="hd-ty hd-sub" aria-hidden="true">
          classificando…
        </span>
      </Label>
      <div className="hd-stage hd-rows" aria-hidden="true">
        <i className="hd-scan" />
        <div className="hd-row">
          <span>Cliente em risco</span>
          <b className="hd-tag hd-tag--u" style={delay(0.5)}>
            urgente
          </b>
        </div>
        <div className="hd-row">
          <span>Negócio fechado</span>
          <b className="hd-tag hd-tag--p" style={delay(0.9)}>
            positiva
          </b>
        </div>
        <div className="hd-row">
          <span>Atualização de status</span>
          <b className="hd-tag hd-tag--r" style={delay(1.4)}>
            rotineira
          </b>
        </div>
      </div>
    </Hd>
  );
}

/** IA · chat do assistente: pergunta digitada, "digitando..." e resposta. */
export function HeaderChat() {
  return (
    <Hd>
      <Label title="IA">
        <span className="hd-sub" aria-hidden="true">
          pergunte aos dados
          <i className="hd-caret" />
        </span>
      </Label>
      <div className="hd-stage hd-flex hd-chat" aria-hidden="true">
        <div className="hd-ub">
          <span className="hd-ut">Vendas desta semana?</span>
        </div>
        <div className="hd-ab">
          <div className="hd-dts">
            <i />
            <i />
            <i />
          </div>
          <div className="hd-rp">12 negócios fechados</div>
        </div>
      </div>
    </Hd>
  );
}
