import type { Metadata } from "next";
import { About } from "@/components/sections/about";

export const metadata: Metadata = {
  title: "Sobre a TechTie",
};

export default function SobrePage() {
  return <About />;
}
