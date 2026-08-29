import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { ServiceJourney } from "@/components/home/ServiceJourney";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { AreasMap } from "@/components/home/AreasMap";
import { CalculatorPreview } from "@/components/home/CalculatorPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PageTransition } from "@/components/ui/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
      <TrustBar />
      <ServiceJourney />
      <FeaturedListings />
      <AreasMap />
      <CalculatorPreview />
      <TestimonialsSection />
      <FinalCTA />
    </PageTransition>
  );
}
