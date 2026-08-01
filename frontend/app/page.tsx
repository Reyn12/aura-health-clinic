import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { SpecialtiesSection } from "@/components/landing/specialties-section";
import { WhyUsSection } from "@/components/landing/why-us-section";
import { DoctorsSection } from "@/components/landing/doctors-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SpecialtiesSection />
        <WhyUsSection />
        <DoctorsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
