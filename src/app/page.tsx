import React from "react";
import {
  Navbar,
  Hero,
  HowItWorks,
  Categories,
  About,
  Footer,
} from "@/features/landing";
import { createClient } from "@/lib/supabase/server";

export default async function  LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user", user)
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
