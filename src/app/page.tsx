import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Categories from "@/components/landing/Categories";
import About from "@/components/landing/About";
import Footer from "@/components/landing/Footer";

const LandingPage = () => {
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
};

export default LandingPage;
