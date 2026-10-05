import { Beams } from "@/components/react-bits/beams";

/**
 * Fundo unico da pagina: so tons de preto (#272727 no centro), feixes verticais
 * discretos (grafite alternando com preto, como um terno) que reagem ao
 * mouse/scroll e a cena WebGL do hero (logo dourada, circuitos), fixo na
 * viewport, atras de todas as sections. As sections ficam transparentes, entao o
 * fundo corre continuo de uma para a outra, sem emenda. Nada fica por cima do
 * canvas: o contraste do texto vem das colunas discretas e do fundo escuro.
 */
export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div className="bg-executive absolute inset-0" />
      <Beams hero />
    </div>
  );
}
