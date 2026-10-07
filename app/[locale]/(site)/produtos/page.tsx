import type { Metadata } from "next";
import { Products } from "@/components/sections/products";

export const metadata: Metadata = {
  title: "Produtos",
};

export default function ProdutosPage() {
  return <Products />;
}
