"use client";

import Hero from "@/components/Hero";
import JourneyMap from "@/components/JourneyMap";
import InternPhase from "@/components/InternPhase";
import TheWorkforce from "@/components/TheWorkforce";
import MCPSection from "@/components/MCPSection";
import MCPToA2ATransition from "@/components/MCPToA2ATransition";
import A2ASection from "@/components/A2ASection";
import BottomLine from "@/components/BottomLine";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-[#F9F8F5] min-h-screen">
      <Navigation />
      <Hero />
      <JourneyMap />
      <InternPhase />
      <TheWorkforce />
      <MCPSection />
      <MCPToA2ATransition />
      <A2ASection />
      <BottomLine />
      <Footer />
    </main>
  );
}
