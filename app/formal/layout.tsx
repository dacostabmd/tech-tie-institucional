import type { ReactNode } from "react";
import { Cormorant_Garamond } from "next/font/google";

// Serifada de titulos da identidade formal; o corpo segue em Inter (layout raiz).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export default function FormalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${cormorant.variable} theme-formal flex min-h-full flex-1 flex-col`}>
      {children}
    </div>
  );
}
