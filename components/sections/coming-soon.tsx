import { FadeIn } from "@/components/layout/fade-in";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="relative flex min-h-[60svh] items-center py-24 sm:py-32">
      <div className="relative mx-auto max-w-3xl px-6">
        <FadeIn>
          <span className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
            Em construção
          </span>
          <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>
        </FadeIn>
      </div>
    </section>
  );
}
