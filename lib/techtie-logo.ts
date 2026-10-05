/**
 * Logo da TechTie: um "T" formado por uma gravata dourada facetada, com uma
 * espiga de trigo em relevo e ondas (seigaiha) na ponta. E gerada por codigo para
 * ter uma unica fonte: serve de arquivo estatico (public/logo.svg, via
 * scripts/generate-logo.mts) e de textura para a cena WebGL do fundo.
 */

type Pt = [number, number];

export const LOGO_VIEWBOX = { width: 240, height: 300 } as const;

const CX = 120;

const f = (n: number) => String(Math.round(n * 100) / 100);
const pts = (list: Pt[]) => list.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const mirror = (list: Pt[]): Pt[] => list.map(([x, y]) => [2 * CX - x, y]);

/** Recuo (offset) de um poligono convexo para dentro, em unidades do viewBox. */
function inset(poly: Pt[], d: number): Pt[] {
  const n = poly.length;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }
  const side = area > 0 ? 1 : -1;

  // Cada aresta vira uma reta deslocada para dentro: ponto + direcao.
  const lines = poly.map((a, i) => {
    const b = poly[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / len;
    const uy = (b[1] - a[1]) / len;
    const nx = -uy * side;
    const ny = ux * side;
    return { px: a[0] + nx * d, py: a[1] + ny * d, ux, uy };
  });

  return lines.map((l1, i) => {
    const l0 = lines[(i + n - 1) % n];
    const det = l0.ux * l1.uy - l0.uy * l1.ux;
    const t = ((l1.px - l0.px) * l1.uy - (l1.py - l0.py) * l1.ux) / det;
    return [l0.px + l0.ux * t, l0.py + l0.uy * t] as Pt;
  });
}

// --- Geometria -------------------------------------------------------------

// Asas do "T" (barra superior): cada asa e um triangulo dobrado ao meio (duas faces).
const wingTop = 6;
const wingL = { a: [4, wingTop] as Pt, b: [CX, wingTop] as Pt, c: [97, 52] as Pt };
const wingLFold: Pt = [(wingL.b[0] + wingL.c[0]) / 2, (wingL.b[1] + wingL.c[1]) / 2];
const wingR = { a: [2 * CX - 4, wingTop] as Pt, b: [CX, wingTop] as Pt, c: [2 * CX - 97, 52] as Pt };
const wingRFold: Pt = [2 * CX - wingLFold[0], wingLFold[1]];

// No: trapezio que estreita ate o pescoco.
const knotL: Pt[] = [[CX - 14, 8], [CX, 8], [CX, 68], [CX - 8, 59]];
const knotR = mirror(knotL);

// Lamina: pescoco estreito, alarga ate a "cintura" e fecha numa ponta.
const blade: Pt[] = [[CX - 7, 56], [CX + 7, 56], [CX + 64, 226], [CX, 294], [CX - 64, 226]];
const bladeInner = inset(blade, 7);
const bladeInner2 = inset(blade, 10.5);

// --- Pecas -----------------------------------------------------------------

/** Grao de trigo: losango curvo de base em (0,0) apontando para cima. */
function grain(x: number, y: number, angle: number, len: number, w: number, fill: string) {
  const d = `M0 0C${f(w)} ${f(-len * 0.22)} ${f(w * 0.75)} ${f(-len * 0.78)} 0 ${f(-len)}C${f(-w * 0.75)} ${f(-len * 0.78)} ${f(-w)} ${f(-len * 0.22)} 0 0Z`;
  return (
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${angle})">` +
    `<path d="${d}" fill="${fill}"/>` +
    `<path d="M0 ${f(-len * 0.08)}L0 ${f(-len * 0.9)}" stroke="#3a2608" stroke-opacity=".55" stroke-width=".9" fill="none"/>` +
    `</g>`
  );
}

function wheat() {
  const out: string[] = [];
  const stemTop = 82;
  const stemBase = 226;

  // Folhas na base, abracando a haste.
  out.push(
    `<path d="M${CX} ${stemBase}C${CX - 12} ${stemBase - 2} ${CX - 24} ${stemBase - 14} ${CX - 26} ${stemBase - 36}C${CX - 14} ${stemBase - 28} ${CX - 5} ${stemBase - 16} ${CX} ${stemBase}Z" fill="url(#gLeaf)"/>`,
    `<path d="M${CX} ${stemBase}C${CX + 12} ${stemBase - 2} ${CX + 24} ${stemBase - 14} ${CX + 26} ${stemBase - 36}C${CX + 14} ${stemBase - 28} ${CX + 5} ${stemBase - 16} ${CX} ${stemBase}Z" fill="url(#gLeafR)"/>`,
  );

  out.push(`<path d="M${CX} ${stemBase}L${CX} ${stemTop + 14}" stroke="url(#gStem)" stroke-width="2.2" stroke-linecap="round" fill="none"/>`);

  // Pares de graos: inclinados e finos, maiores no meio da espiga.
  const rows = [
    { y: 188, a: 36, len: 26, w: 6.4 },
    { y: 171, a: 34, len: 27, w: 6.6 },
    { y: 154, a: 32, len: 27, w: 6.6 },
    { y: 137, a: 29, len: 25, w: 6.2 },
    { y: 121, a: 26, len: 22, w: 5.6 },
    { y: 107, a: 22, len: 18, w: 4.8 },
  ];
  for (const r of rows) {
    out.push(grain(CX, r.y, -r.a, r.len, r.w, "url(#gGrainL)"));
    out.push(grain(CX, r.y, r.a, r.len, r.w, "url(#gGrainR)"));
  }
  out.push(grain(CX, 97, 0, 20, 5.2, "url(#gGrainL)"));
  // Arista central da espiga.
  out.push(`<path d="M${CX} 78L${CX} ${stemTop - 12}" stroke="#f3d57a" stroke-width=".9" stroke-linecap="round"/>`);

  return out.join("");
}

/** Ondas seigaiha: escamas concentricas sobrepostas, de cima para baixo. */
function waves() {
  const r = 11;
  const out: string[] = [];
  for (let j = 0; j < 22; j++) {
    const cy = 224 + j * (r / 2);
    for (let i = -6; i <= 6; i++) {
      const cx = CX + (i + (j % 2) * 0.5) * 2 * r;
      out.push(
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#24190a" stroke="url(#gWave)" stroke-width="1"/>` +
          `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.68)}" fill="none" stroke="url(#gWave)" stroke-width=".9"/>` +
          `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.36)}" fill="none" stroke="url(#gWave)" stroke-width=".9"/>`,
      );
    }
  }
  return out.join("");
}

export interface LogoOptions {
  /** "mark": versao simplificada (sem trigo/ondas), legivel em tamanhos pequenos. */
  variant?: "full" | "mark";
}

export function buildLogoSvg({ variant = "full" }: LogoOptions = {}): string {
  const full = variant === "full";
  const { width, height } = LOGO_VIEWBOX;

  const defs = `
<defs>
  <linearGradient id="gW1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset="1" stop-color="#efca66"/></linearGradient>
  <linearGradient id="gW2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a940"/><stop offset="1" stop-color="#946a1e"/></linearGradient>
  <linearGradient id="gW3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8c056"/><stop offset="1" stop-color="#b98a2c"/></linearGradient>
  <linearGradient id="gW4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a6f20"/><stop offset="1" stop-color="#5d3f10"/></linearGradient>
  <linearGradient id="gKL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d878"/><stop offset="1" stop-color="#b48528"/></linearGradient>
  <linearGradient id="gKR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b78a2c"/><stop offset="1" stop-color="#6a4812"/></linearGradient>
  <linearGradient id="gBL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe9a6"/><stop offset=".45" stop-color="#e2b64f"/><stop offset="1" stop-color="#a8791f"/></linearGradient>
  <linearGradient id="gBR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9ab43"/><stop offset=".5" stop-color="#a97b22"/><stop offset="1" stop-color="#5e4010"/></linearGradient>
  <linearGradient id="gInner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17110a"/><stop offset=".55" stop-color="#2a1d0c"/><stop offset="1" stop-color="#1b1308"/></linearGradient>
  <linearGradient id="gGrainL" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c8923a"/><stop offset="1" stop-color="#fbe596"/></linearGradient>
  <linearGradient id="gGrainR" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#9a6c22"/><stop offset="1" stop-color="#e2b755"/></linearGradient>
  <linearGradient id="gLeaf" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b98a2c"/><stop offset="1" stop-color="#f3d57a"/></linearGradient>
  <linearGradient id="gLeafR" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8f651c"/><stop offset="1" stop-color="#d9ab43"/></linearGradient>
  <linearGradient id="gStem" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b98a2c"/><stop offset="1" stop-color="#f6dc8a"/></linearGradient>
  <linearGradient id="gWave" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1cd6c"/><stop offset="1" stop-color="#9c7122"/></linearGradient>
  <linearGradient id="gSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="gWaveFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".12" stop-color="#fff"/></linearGradient>
  <clipPath id="cInner"><polygon points="${pts(bladeInner2)}"/></clipPath>
  <mask id="mWave" maskUnits="userSpaceOnUse" x="0" y="214" width="${width}" height="86"><rect x="0" y="214" width="${width}" height="86" fill="url(#gWaveFade)"/></mask>
</defs>`;

  // Barra do T: asas facetadas.
  const wings =
    `<polygon points="${pts([wingL.a, wingL.b, wingLFold])}" fill="url(#gW1)"/>` +
    `<polygon points="${pts([wingL.a, wingLFold, wingL.c])}" fill="url(#gW2)"/>` +
    `<polygon points="${pts([wingR.a, wingR.b, wingRFold])}" fill="url(#gW3)"/>` +
    `<polygon points="${pts([wingR.a, wingRFold, wingR.c])}" fill="url(#gW4)"/>`;

  const knot =
    `<polygon points="${pts(knotL)}" fill="url(#gKL)"/>` +
    `<polygon points="${pts(knotR)}" fill="url(#gKR)"/>` +
    // Filete de luz na quina do no.
    `<path d="M${CX} 9L${CX} 58" stroke="#fff3c0" stroke-opacity=".5" stroke-width=".8"/>`;

  // Lamina: moldura dourada em duas faces (quina central) + miolo escuro com relevo.
  const [neckL, neckR, waistR, tip, waistL] = blade;
  const leftFace = `<polygon points="${pts([neckL, [CX, neckL[1]], tip, waistL])}" fill="url(#gBL)"/>`;
  const rightFace = `<polygon points="${pts([[CX, neckR[1]], neckR, waistR, tip])}" fill="url(#gBR)"/>`;

  const inner =
    `<polygon points="${pts(bladeInner)}" fill="url(#gInner)"/>` +
    `<polygon points="${pts(bladeInner2)}" fill="none" stroke="#e9c35f" stroke-opacity=".55" stroke-width=".7"/>`;

  const art = full
    ? `<g clip-path="url(#cInner)"><g mask="url(#mWave)">${waves()}</g></g>${wheat()}`
    : "";

  const sheen = `<polygon points="${pts(blade)}" fill="url(#gSheen)"/>`;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="TechTie">` +
    `<title>TechTie</title>` +
    defs +
    leftFace +
    rightFace +
    inner +
    art +
    sheen +
    knot +
    wings +
    `</svg>`
  );
}

export const LOGO_ASPECT = LOGO_VIEWBOX.width / LOGO_VIEWBOX.height;
