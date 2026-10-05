# TechTie — Site institucional

Site institucional (Next.js 15, App Router, TypeScript, SSG, i18n) da
TechTie, empresa de soluções tecnológicas sob medida: dashboards de
Business Intelligence, CRM, automações e integrações, inteligência
artificial, enriquecimento de dados, sites institucionais e landing pages.

## Stack

- Next.js 15 (App Router, geracao estatica)
- TypeScript
- next-intl (i18n: `pt-BR`, `en`, `es`)
- Tailwind CSS v4 (tokens de tema em `app/globals.css`)
- shadcn/ui (Radix UI) — Alert, Button, Popover, Separator
- Motion (`motion/react`) para animacoes, com suporte a
  `prefers-reduced-motion`
- lucide-react para icones
- Fontes auto-hospedadas via `next/font` (Manrope + Liter)

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
neste site.

## Lint

```bash
npm run lint
```

## Estrutura principal

- `app/[locale]/layout.tsx` — layout raiz por idioma, fontes, Metadata API
  e JSON-LD
- `app/[locale]/(site)/` — paginas do site (`page.tsx`, `produtos`,
  `servicos`, `sobre`, `contato`)
- `app/sitemap.ts` / `app/robots.ts` — SEO tecnico
- `app/actions/lead.ts` — Server Action de demonstracao do formulario de
  contato (ver secao abaixo)
- `components/sections/*` — uma secao por arquivo
- `components/ui/*` — componentes shadcn/ui
- `i18n/` e `messages/*.json` — rotas localizadas e strings por idioma
- `lib/site-config.ts` — dados centrais (links, WhatsApp, CNPJ etc.)

## O que substituir antes de publicar

Os itens abaixo sao placeholders e precisam ser substituidos por dados
reais antes de colocar o site no ar:

1. **Numero de WhatsApp** (`lib/site-config.ts`, campo
   `whatsappNumber`) — numero placeholder, substituir pelo numero real
   usado no botao flutuante e no CTA do hero.
2. **CNPJ** (`lib/site-config.ts`, campo `cnpj`) — CNPJ placeholder
   exibido no rodape, substituir pelo CNPJ real da empresa.
3. **E-mail de contato** (`lib/site-config.ts`, campo `contactEmail`) —
   substituir pelo e-mail institucional real.
4. **Endereco** (`lib/site-config.ts`, campo `address`) — placeholder,
   nao exibido atualmente na pagina, mas reservado para uso futuro no
   rodape caso necessario.
5. **Links institucionais do rodape** (`components/sections/footer.tsx`)
   — "Sobre a TechTie", "Politica de privacidade" e "Termos de uso" apontam
   para `#` (placeholder). Criar as paginas correspondentes e atualizar os
   links.
6. **Open Graph image** (`app/[locale]/layout.tsx`, referencia a
   `/og-image.png`) — nao ha arquivo de imagem incluido; adicionar um
   arquivo real em `public/og-image.png` (1200x630) antes de publicar.
7. **Logo** (`app/[locale]/layout.tsx`, referencia a `/logo.svg` no
   JSON-LD) — confirmar que o arquivo publicado corresponde a logo final.
8. **URL do site** (`app/[locale]/layout.tsx`, `app/sitemap.ts` —
   constante `siteUrl`/`https://www.techtie.com.br`) — confirmar o
   dominio definitivo de producao.
9. **Server Action do formulario** (`app/actions/lead.ts`) — hoje apenas
   simula o envio com `console.log`. Integrar com o servico real (CRM,
   automacao de marketing, webhook) antes de publicar.
10. **Paginas "Produtos" e "Servicos"** (`app/[locale]/(site)/produtos`,
    `.../servicos`) — hoje exibem um placeholder "em breve"
    (`components/sections/coming-soon.tsx`). Substituir pelo detalhamento
    real de cada solucao antes de publicar.
