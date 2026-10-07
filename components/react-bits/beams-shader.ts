/**
 * Shader da cena do hero (ogl, um unico fragment shader em tela cheia).
 *
 * Camadas, de baixo para cima:
 * 1. colunas verticais discretas em tons de preto/grafite (a "risca de terno" da marca);
 * 2. arte do hero, presa ao documento (rola junto com a pagina) e ancorada nos
 *    elementos HTML: circuitos dourados com pulsos de luz ligando a logo aos cartoes;
 * 3. a logo dourada (textura gerada de lib/techtie-logo.ts) com brilho metalico.
 *
 * Coordenadas: `p` e a tela em unidades da altura (y para cima, origem no centro);
 * `q = p - scroll` e a "cena" (fixa no documento). Os uniforms de ancora chegam em
 * unidades de cena (ver readAnchors em beams-canvas.tsx).
 */

export const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

type Pt = [number, number];

// Trilhos da direita, em unidades de meia-altura da logo (origem no centro dela):
// barramentos com dobras de 45 graus, como uma placa de circuito, que saem da
// lamina e se perdem para a direita (a logo fica na coluna da direita do hero).
const RIGHT_TRACES: { pts: Pt[]; seed: number; node?: boolean }[] = [
  { pts: [[0.6, -0.55], [0.95, -0.55], [1.2, -0.8], [3.2, -0.8]], seed: 0.1, node: true },
  { pts: [[0.46, -0.72], [0.72, -0.72], [0.9, -0.9], [1.5, -0.9], [1.75, -1.15], [3.4, -1.15]], seed: 0.55, node: true },
  { pts: [[0.3, -1.0], [0.5, -1.0], [0.78, -1.28], [2.6, -1.28]], seed: 0.8, node: true },
  { pts: [[2.2, -0.8], [2.5, -0.5], [3.0, -0.5]], seed: 0.3 },
];

// Nos extras (aneis) nas pontas dos ramais.
const RIGHT_NODES: Pt[] = [[3.0, -0.5]];

const f = (n: number) => (Number.isInteger(n) ? `${n}.0` : String(n));

function traceBlock(pts: Pt[], seed: number, fade: string) {
  let code = `  { vec2 best = vec2(1e3, 0.0); float s = 0.0;\n`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    code += `    segAcc(best, q, LP(${f(ax)}, ${f(ay)}), LP(${f(bx)}, ${f(by)}), s);\n`;
  }
  code += `    vec4 L = lineLight(best, ${f(seed)}, ${fade});\n    over(art, L.rgb, L.a); }\n`;
  return code;
}

const rightTraces = RIGHT_TRACES.map((t) => traceBlock(t.pts, t.seed, "fadeR")).join("");
const rightNodes = [
  ...RIGHT_TRACES.filter((t) => t.node).map((t) => t.pts[0]),
  ...RIGHT_NODES,
]
  .map(([x, y], i) => `  { vec4 N = nodeLight(q, LP(${f(x)}, ${f(y)}), ${i === 0 ? "0.0135" : "0.0105"}, ${f(i * 0.37)}, fadeR); over(art, N.rgb, N.a); }\n`)
  .join("");

export const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float uTime;
uniform float uClock;
uniform vec2 uRes;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uScrollY;
uniform float uAngle;
uniform float uIntensity;
uniform float uGrain;

uniform float uHero;
uniform sampler2D uLogoTex;
uniform float uLogoReady;
uniform vec4 uLogo;
uniform vec2 uCard0;
uniform vec2 uCard1;
uniform vec2 uCard2;
uniform vec4 uCard0Rect;
uniform vec4 uCard1Rect;
uniform vec4 uCard2Rect;
uniform float uCardsOn;

const int BEAMS = 16;
const float NBEAMS = 16.0;
const float TAU = 6.2831853;
// Suavizacao da borda entre colunas (anti-alias, em unidades de coluna).
const float EDGE = 0.006;
// Opacidade maxima relativa de cada familia de coluna.
const float ACCENT_GAIN = 0.65;
const float COLOR_GAIN = 0.67;

const vec3 GOLD = vec3(0.93, 0.74, 0.34);
const vec3 GOLD_HI = vec3(1.0, 0.91, 0.66);

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

// Composicao "over" em espaco pre-multiplicado.
void over(inout vec4 acc, vec3 col, float a) {
  a = clamp(a, 0.0, 1.0);
  acc.rgb = col * a + acc.rgb * (1.0 - a);
  acc.a = a + acc.a * (1.0 - a);
}

// Distancia ao segmento ab; guarda o comprimento de arco do ponto mais proximo.
void segAcc(inout vec2 best, vec2 p, vec2 a, vec2 b, inout float s) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float l = length(ba);
  float h = clamp(dot(pa, ba) / (l * l + 1e-6), 0.0, 1.0);
  float d = length(pa - ba * h);
  if (d < best.x) best = vec2(d, s + h * l);
  s += l;
}

// Trilho: fio fino + brilho suave + cometa que corre pelo comprimento do fio.
vec4 lineLight(vec2 best, float seed, float fade) {
  float d = best.x;
  float w = max(0.00035, 0.55 / uRes.y);
  float core = 1.0 - smoothstep(w, w * 2.6, d);
  float glow = exp(-d / 0.011);
  float ph = fract(best.y * 1.15 - uClock * 0.2 + seed);
  float comet = smoothstep(0.0, 0.02, ph) * exp(-ph * 8.0);
  float a = (core * (0.42 + 0.58 * comet) + glow * 0.09 * (0.35 + comet)) * fade;
  return vec4(mix(GOLD, GOLD_HI, comet), a);
}

// No do circuito: anel duplo + miolo brilhante + halo que pulsa.
vec4 nodeLight(vec2 p, vec2 c, float r, float seed, float fade) {
  float d = length(p - c);
  float w = max(0.00035, 0.55 / uRes.y);
  float ring1 = 1.0 - smoothstep(w, w * 1.8, abs(d - r));
  float ring2 = (1.0 - smoothstep(w, w * 1.8, abs(d - r * 1.9))) * 0.45;
  float core = 1.0 - smoothstep(r * 0.2, r * 0.3, d);
  float beat = 0.65 + 0.35 * sin(uClock * 1.6 + seed * 6.2831);
  float halo = exp(-d / (r * 3.2)) * 0.3 * beat;
  float a = (ring1 + ring2 + core + halo) * fade;
  return vec4(mix(GOLD, GOLD_HI, core), a);
}

#define LP(x, y) (lc + hh * vec2(x, y))

// Meia-largura da lamina da logo (em meias-alturas) na altura uy (-1 ponta, 1 topo).
float bladeHalf(float uy) {
  float sy = 150.0 - 150.0 * uy;
  float hwSvg = sy < 226.0
    ? 7.0 + clamp((sy - 56.0) / 170.0, 0.0, 1.0) * 57.0
    : 64.0 * clamp((294.0 - sy) / 68.0, 0.0, 1.0);
  return hwSvg / 150.0;
}

// Arte do hero em coordenadas de cena. Devolve o acumulado pre-multiplicado.
void heroArt(inout vec4 art, vec2 q) {
  vec2 lc = uLogo.xy;
  float hw = uLogo.z;
  float hh = uLogo.w;
  float fadeR = exp(-max(0.0, (q.x - lc.x) / hh - 0.6) * 0.75);

  // Circuitos da direita (barramentos que saem da lamina).
  if (q.x > lc.x + 0.1 * hh && q.y < lc.y + hh * 0.2 && q.y > lc.y - hh * 1.9) {
${rightTraces}${rightNodes}  }

  // Circuitos da esquerda: da lamina ate os cartoes (nos ancorados no HTML).
  if (uCardsOn > 0.5 && q.x < lc.x - 0.1 * hh) {
    for (int i = 0; i < 3; i++) {
      vec2 A = i == 0 ? uCard0 : (i == 1 ? uCard1 : uCard2);
      vec4 R = i == 0 ? uCard0Rect : (i == 1 ? uCard1Rect : uCard2Rect);
      float fy = float(i) - 1.0;
      float sy = -0.5 * fy * 0.9;
      vec2 S = lc + hh * vec2(-(bladeHalf(sy) + 0.14), sy);
      float dy = abs(A.y - S.y);
      float xm = min(S.x - 0.02, max(S.x - 0.3 * hh, A.x + 0.04 + dy));
      vec2 P1 = vec2(xm, S.y);
      vec2 P2 = vec2(max(xm - dy, A.x + 0.012), A.y);
      // Contorno do cartao, partindo do ponto medio da lateral direita (onde a
      // linha reta chega) e voltando ao mesmo ponto: percorrido em seguida da
      // linha reta, no mesmo acumulador de arco, para o cometa dar continuidade.
      vec2 rc = R.xy;
      float rw = R.z;
      float rh = R.w;
      vec2 TR = rc + vec2(rw, rh);
      vec2 BR = rc + vec2(rw, -rh);
      vec2 TL = rc + vec2(-rw, rh);
      vec2 BL = rc + vec2(-rw, -rh);
      vec2 RM = rc + vec2(rw, 0.0);

      vec2 best = vec2(1e3, 0.0);
      float s = 0.0;
      segAcc(best, q, S, P1, s);
      segAcc(best, q, P1, P2, s);
      segAcc(best, q, P2, A, s);
      segAcc(best, q, RM, TR, s);
      segAcc(best, q, TR, TL, s);
      segAcc(best, q, TL, BL, s);
      segAcc(best, q, BL, BR, s);
      segAcc(best, q, BR, RM, s);
      vec4 L = lineLight(best, 0.2 + 0.27 * float(i), 1.0);
      over(art, L.rgb, L.a);

      vec4 NS = nodeLight(q, S, 0.0095, 0.15 * float(i), 1.0);
      over(art, NS.rgb, NS.a);
      vec4 NA = nodeLight(q, A, 0.0125, 0.31 * float(i) + 0.2, 1.0);
      over(art, NA.rgb, NA.a);
    }
  }

  vec2 lh = vec2(2.0 * hw, 2.0 * hh);

  // Logo com brilho metalico que varre as facetas (e acompanha o mouse).
  if (uLogoReady > 0.5) {
    vec2 lp = (q - lc + uPointer * vec2(0.006, 0.004)) / lh + 0.5;
    if (lp.x > 0.0 && lp.x < 1.0 && lp.y > 0.0 && lp.y < 1.0) {
      vec4 L = texture2D(uLogoTex, lp);
      float lum = dot(L.rgb, vec3(0.3, 0.59, 0.11)) / max(L.a, 0.001);
      float diag = (lp.x - 0.5) * 0.8 + (lp.y - 0.5) * 0.6;
      float pos = sin(uClock * 0.45) * 0.5 + uPointer.x * 0.3;
      float band = exp(-pow((diag - pos) / 0.085, 2.0));
      L.rgb += GOLD_HI * band * 0.6 * L.a * smoothstep(0.2, 0.75, lum);
      L.rgb *= 1.0 + 0.08 * sin(uClock * 0.8);
      art.rgb = L.rgb + art.rgb * (1.0 - L.a);
      art.a = L.a + art.a * (1.0 - L.a);
    }
  }
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

  // Efeito terno: colunas pares no tom de acento (ouro), impares em champanhe.
  float isAccent = 1.0 - mod(idx, 2.0);
  float gain = mix(COLOR_GAIN, ACCENT_GAIN, isAccent);
  vec3 tint = mix(uColor, uAccent, isAccent);
  float a = clamp(v * uIntensity * gain, 0.0, 1.0);

  // Saida pre-multiplicada (contexto criado com premultipliedAlpha).
  vec4 outc = vec4(tint * a, a);

  if (uHero > 0.5) {
    // Cena presa ao documento: rola junto com a pagina.
    vec2 sc = p - vec2(0.0, uScrollY);
    if (sc.y < uLogo.y + uLogo.w * 1.6 && sc.y > uLogo.y - uLogo.w * 2.4) {
      heroArt(outc, sc);
    }
  }

  gl_FragColor = outc;
}`;
