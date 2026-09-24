import HeroSection from "@/components/home/HeroSection";
import AudienceCards from "@/components/home/AudienceCards";
import HowGreenBridgeWorks from "@/components/home/HowGreenBridgeWorks";
import WhyGreenBridge from "@/components/home/WhyGreenbridge";
import HomeCTA from "@/components/home/HomeCTA";

export default function HomePage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <AudienceCards />
      <HowGreenBridgeWorks />
      <WhyGreenBridge />
      <HomeCTA />
    </main>
  );
}
