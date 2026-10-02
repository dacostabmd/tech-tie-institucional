import { PageBackground } from "@/components/layout/page-background";
import { TopTitle } from "@/components/sections/top-title";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Footer } from "@/components/sections/footer";
import { WhatsappFloat } from "@/components/sections/whatsapp-float";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-full flex-1 flex-col">
      <PageBackground />
      <main className="flex-1">
        <TopTitle />
        <Hero />
        <Separator className="mx-auto max-w-6xl bg-border" />
        <HowItWorks />
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}
