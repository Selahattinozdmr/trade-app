import React from "react";
import {
  Navbar,
  Hero,
  HowItWorks,
  Categories,
  About,
  Footer,
} from "@/features/landing";

export default function LandingPage() {
  return (
    <div className="bg-white text-black scroll-smooth">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Categories />
      <About />
      <Footer />
    </div>
  );
}
