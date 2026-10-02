import { Beams } from "@/components/react-bits/beams";

/**
 * Fundo unico da pagina: grafite com iluminacao de estudio, feixes verticais
 * (vermelho discreto alternando com branco, como um terno) que reagem ao
 * mouse/scroll e risca de giz, fixo na viewport, atras de todas as sections. As sections ficam transparentes, entao o fundo corre
 * continuo de uma para a outra, sem emenda.
 */
export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div className="bg-executive absolute inset-0" />
      {/* Mascara deixa o texto (esquerda) legivel e concentra os feixes a direita. */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_right,rgba(0,0,0,0.55),black_62%)]">
        <Beams />
      </div>
      {/* Bolsao escuro fixo atras da coluna de texto: como acompanha a viewport,
          o contraste AA vale em qualquer ponto da rolagem e nao ha emenda entre sections. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_130%_120%_at_50%_50%,rgba(13,15,18,0.6),transparent_92%)] md:bg-[radial-gradient(ellipse_58%_120%_at_40%_50%,rgba(13,15,18,0.68),transparent_92%)]" />
      <div className="bg-executive-stripes absolute inset-0" />
    </div>
  );
}
