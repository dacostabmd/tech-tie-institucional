/**
 * Shader da cena do hero (ogl, um unico fragment shader em tela cheia), desenhada
 * sobre transparente por cima do fundo (Grainient). Camadas, de baixo para cima:
 * 1. arte do hero, presa ao documento (rola junto com a pagina) e ancorada nos
 *    elementos HTML: circuitos dourados com pulsos de luz ligando a logo aos cartoes;
 * 2. a logo dourada (textura gerada de lib/techtie-logo.ts) com brilho metalico.
 *
 * Coordenadas: `p` e a tela em unidades da altura (y para cima, origem no centro);
 * `sc = p - scrollY` e a "cena" (fixa no documento). Os uniforms de ancora chegam em
 * unidades de cena (ver readAnchors em beams-canvas.tsx).
 */

export const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;


export const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float uClock;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uScrollY;

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

const vec3 GOLD = vec3(0.93, 0.74, 0.34);
const vec3 GOLD_HI = vec3(1.0, 0.91, 0.66);

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
      vec2 best = vec2(1e3, 0.0);
      float s = 0.0;
      segAcc(best, q, S, P1, s);
      segAcc(best, q, P1, P2, s);
      segAcc(best, q, P2, A, s);
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

  // Colunas de fundo removidas (o fundo agora vem do Grainient, por baixo deste
  // canvas); so resta a arte do hero (logo + circuitos), sobre transparente.
  vec4 outc = vec4(0.0);

  if (uHero > 0.5) {
    // Cena presa ao documento: rola junto com a pagina.
    vec2 sc = p - vec2(0.0, uScrollY);
    if (sc.y < uLogo.y + uLogo.w * 1.6 && sc.y > uLogo.y - uLogo.w * 2.4) {
      heroArt(outc, sc);
    }
  }

  gl_FragColor = outc;
}`;
