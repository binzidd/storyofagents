"use client";

import Hero from "@/components/Hero";
import InternPhase from "@/components/InternPhase";
import TheWorkforce from "@/components/TheWorkforce";
import MCPSection from "@/components/MCPSection";
import A2ASection from "@/components/A2ASection";
import BottomLine from "@/components/BottomLine";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-[#050814] min-h-screen">
      <Navigation />
      <Hero />
      <InternPhase />
      <TheWorkforce />
      <MCPSection />
      <A2ASection />
      <BottomLine />
      <Footer />
    </main>
  );
}
