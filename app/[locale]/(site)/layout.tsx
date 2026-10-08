import { PageBackground } from "@/components/layout/page-background";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { WhatsappFloat } from "@/components/sections/whatsapp-float";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-full flex-1 flex-col">
      <PageBackground />
      <Navbar />
      <main className="flex-1 pt-[var(--header-h,5.5rem)]">{children}</main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}
