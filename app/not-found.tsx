import Link from "next/link";

// Fallback global do Next.js para /_not-found (fora do [locale]): o app router
// exige essa entrada no nivel raiz mesmo com toda a navegacao sob [locale].
// Usa texto fixo em pt-BR (sem acesso a next-intl aqui) e os mesmos tokens de
// cor do tema (ver app/globals.css) para manter a identidade visual.
export default function NotFound() {
  return (
    <html lang="pt-BR" className="dark h-full">
      <body className="flex min-h-full flex-col items-center justify-center bg-background px-6 text-center text-foreground">
        <span className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
          Erro 404
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          O conteúdo que você procura não existe ou foi movido.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl border border-gold-soft/60 px-6 py-3 text-sm text-gold-soft transition-colors hover:bg-gold-muted"
        >
          Voltar ao início
        </Link>
      </body>
    </html>
  );
}
