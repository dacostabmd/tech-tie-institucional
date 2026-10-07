import type { Metadata } from "next";
import { Results } from "@/components/sections/results";

export const metadata: Metadata = {
  title: "Nossos Resultados",
};

export default function ResultadosPage() {
  return <Results />;
}
