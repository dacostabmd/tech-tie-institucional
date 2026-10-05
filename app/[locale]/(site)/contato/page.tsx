import type { Metadata } from "next";
import { LeadSection } from "@/components/sections/lead-section";

export const metadata: Metadata = {
  title: "Contato",
};

export default function ContatoPage() {
  return <LeadSection />;
}
