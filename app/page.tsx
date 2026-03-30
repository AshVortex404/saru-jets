import { SiteHeader } from "@/components/site-header";
import { HeroScroll } from "@/components/hero/HeroScroll";
import { LuxuryIntro } from "@/components/sections/LuxuryIntro";
import { PlaneMorph } from "@/components/plane/PlaneMorph";
import { Advantages } from "@/components/sections/Advantages";
import { Globe } from "@/components/globe/Globe";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <SiteHeader />
      <HeroScroll />
      <LuxuryIntro />
      <PlaneMorph />
      <Advantages />
      <Globe />
      <Footer />
    </main>
  );
}
