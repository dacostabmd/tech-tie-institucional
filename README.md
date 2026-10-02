# Prosec — Landing Page

Landing page de uma pagina (Next.js 15, App Router, TypeScript, SSG) para o
produto Prosec, plataforma de acompanhamento processual juridico
inteligente.

## Stack

- Next.js 15 (App Router, geracao estatica)
- TypeScript
- Tailwind CSS v4 (tokens de tema em `app/globals.css`)
- shadcn/ui (Radix UI) — NavigationMenu, Sheet, Button, Badge, Card,
  Carousel, Avatar, Alert, Accordion, Separator
- Motion (`motion/react`) para animacoes, com suporte a
  `prefers-reduced-motion`
- lucide-react para icones
- Fontes auto-hospedadas via `next/font` (Playfair Display + Inter)

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build de producao

```bash
npm run build
npm run start
```

O comando `next build` gera paginas estaticas (SSG) — nao ha backend real
nesta landing page.

## Lint

```bash
npm run lint
```

## Estrutura principal

- `app/layout.tsx` — layout raiz, fontes, Metadata API e JSON-LD
- `app/page.tsx` — composicao das secoes da landing page
- `app/sitemap.ts` / `app/robots.ts` — SEO tecnico
- `app/actions/lead.ts` — Server Action de demonstracao do formulario de
  contato (ver secao abaixo)
- `components/sections/*` — uma secao por arquivo
- `components/ui/*` — componentes shadcn/ui
- `lib/site-config.ts` — dados centrais (links, WhatsApp, CNPJ etc.)

## O que substituir antes de publicar

Os itens abaixo sao placeholders e precisam ser substituidos por dados
reais antes de colocar o site no ar:

1. **Depoimentos** (`components/sections/testimonials.tsx`) — sao
   ficticios. Por exigencia da OAB, substituir por depoimentos reais e
   devidamente autorizados pelos clientes antes da publicacao.
2. **Numero de WhatsApp** (`lib/site-config.ts`, campo
   `whatsappNumber`) — numero placeholder, substituir pelo numero real
   usado no botao flutuante e no CTA do hero.
3. **CNPJ** (`lib/site-config.ts`, campo `cnpj`) — CNPJ placeholder
   exibido no rodape, substituir pelo CNPJ real da empresa.
4. **E-mail de contato** (`lib/site-config.ts`, campo `contactEmail`) —
   substituir pelo e-mail institucional real.
5. **Endereco** (`lib/site-config.ts`, campo `address`) — placeholder,
   nao exibido atualmente na pagina, mas reservado para uso futuro no
   rodape caso necessario.
6. **Metricas/numeros** (`components/sections/metrics.tsx`) — valores
   plausiveis, mas ilustrativos. Ajustar com dados reais e validados
   antes de publicar.
7. **Links institucionais do rodape** (`components/sections/footer.tsx`)
   — "Sobre a Prosec", "Politica de privacidade" e "Termos de uso" apontam
   para `#` (placeholder). Criar as paginas correspondentes e atualizar os
   links.
8. **Open Graph image** (`app/layout.tsx`, referencia a
   `/og-image.png`) — nao ha arquivo de imagem incluido; adicionar um
   arquivo real em `public/og-image.png` (1200x630) antes de publicar.
9. **Logo** (`app/layout.tsx`, referencia a `/logo.png` no JSON-LD) —
   adicionar arquivo de logo real em `public/logo.png`.
10. **URL do site** (`app/layout.tsx`, `app/sitemap.ts`,
    `app/robots.ts` — constante `siteUrl`/`https://www.prosec.com.br`) —
    confirmar o dominio definitivo de producao.
11. **Server Action do formulario** (`app/actions/lead.ts`) — hoje apenas
    simula o envio com `console.log`. Integrar com o servico real (CRM,
    automacao de marketing, webhook) antes de publicar.

## Variante formal (`/formal`)

Segunda identidade visual, pensada para teste A/B ou para substituir a home:
marinho institucional + marfim + latao, titulos em Cormorant Garamond.

- Rota: `app/formal/` (layout com a fonte serifada e `page.tsx`). Esta com
  `noindex` e canonical para `/` ate ser promovida. Tokens `--f-*` em
  `app/globals.css`.
- Secoes: `components/formal/*`. A home (`/`) segue com o design original
  em `components/sections/*`.
- Estrutura Problema -> Solucao -> Prova ->
  CTA, com um unico CTA primario ("Consultar gratis") repetido.
- O CTA do hero e um campo de numero CNJ com mascara (`lib/cnj.ts`): ao
  enviar, rola ate o formulario final com o numero ja preenchido
  (`components/formal/lead-context.tsx`).
- CTA persistente no mobile e botao de WhatsApp no desktop
  (`sticky-cta.tsx`), ocultos no hero e quando o formulario esta visivel.
- Todos os CTAs tem `data-cta="..."` para rastrear cliques no analytics.
- Fundos React Bits (`components/react-bits/`): Threads (hero, WebGL/ogl,
  apenas em telas >= 768px), Shape Grid (como funciona, Canvas 2D) e Light
  Rays (CTA final, WebGL/ogl). Todos carregados sob demanda, pausados fora
  da viewport e desligados com `prefers-reduced-motion`.
- Animacoes React Bits: Blur Text, Rotating Text, Count Up e Spotlight Card.

Antes de publicar, alem dos itens acima: validar com o comercial/juridico
as microcopies "Sem compromisso" e "Leva menos de um minuto", e trocar os
numeros e depoimentos ilustrativos (mesma regra da OAB).

## Observacoes de conformidade

O conteudo foi escrito evitando promessas de resultado processual e
linguagem comercial agressiva, em linha com as diretrizes da OAB. Revisar
o texto final com a area juridica/compliance antes da publicacao.
