import type { Metadata } from "next";
import { Solutions } from "@/components/sections/solutions";

export const metadata: Metadata = {
  title: "Soluções",
};

export default function SolucoesPage() {
  return <Solutions />;
}
