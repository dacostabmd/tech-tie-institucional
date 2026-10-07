import type { Metadata } from "next";
import { Services } from "@/components/sections/services";

export const metadata: Metadata = {
  title: "Serviços",
};

export default function ServicosPage() {
  return <Services />;
}
