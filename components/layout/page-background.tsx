import { Beams } from "@/components/react-bits/beams";
import { Grainient } from "@/components/react-bits/grainient";

/**
 * Fundo unico da pagina: gradiente animado (Grainient, WebGL) em tons de preto com
 * um acento dourado, fixo na viewport, atras de todas as sections. Por cima, a cena
 * do hero (logo dourada, circuitos) continua ancorada no HTML via Beams. As sections
 * ficam transparentes, entao o fundo corre continuo de uma para a outra, sem emenda.
 */
export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Grainient
        className="absolute inset-0"
        color1="#232323"
        color2="#232323"
        color3="#97740e"
        timeSpeed={0.65}
        colorBalance={-0.15}
        warpStrength={0}
        warpFrequency={11.9}
        warpSpeed={2}
        warpAmplitude={5}
        blendAngle={62}
        blendSoftness={1}
        rotationAmount={1330}
        noiseScale={0}
        grainAmount={0.1}
        grainScale={8}
        grainAnimated
        contrast={0.95}
        gamma={0.7}
        saturation={1.55}
        centerX={0}
        centerY={0}
        zoom={0.95}
      />
      <Beams hero />
    </div>
  );
}
