import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionContainer } from "@/components/ui/SectionContainer";
import Link from "next/link";

interface HeroBackgroundProps {
  className?: string;
}

function HeroBackground({ className }: HeroBackgroundProps) {
  return (
    <div className={className}>
      <div className="absolute top-20 right-20 w-32 h-32 bg-orange-300 rounded-full opacity-20"></div>
      <div className="absolute top-40 right-40 w-16 h-16 bg-orange-400 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-200 rounded-full opacity-25"></div>

      {/* World map background */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 400"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M200 150 Q250 120 300 150 Q350 180 400 150 Q450 120 500 150"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M150 200 Q200 170 250 200 Q300 230 350 200 Q400 170 450 200"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="250" cy="180" r="8" fill="currentColor" />
          <circle cx="350" cy="190" r="6" fill="currentColor" />
          <circle cx="450" cy="170" r="7" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

interface HeroContentProps {
  title: string;
  subtitle: string;
  ctaText: string;
}

function HeroContent({ title, subtitle, ctaText }: HeroContentProps) {
  return (
    <div className="flex-1 lg:pr-12">
      <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
        {title}
        <br />
        <span className="text-orange-500">Takaslanabilir!</span>
      </h1>
      <p className="text-xl text-gray-700 mb-8 leading-relaxed">{subtitle}</p>
      <Link href={"/sign-in"}>
        <Button size="lg" className="hover:cursor-pointer">
          {ctaText}
        </Button>
      </Link>
    </div>
  );
}

interface HeroImageProps {
  src: string;
  alt: string;
}

function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <div className="flex-1 flex justify-center lg:justify-end">
      <Image
        src={src}
        alt={alt}
        width={500}
        height={500}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
        priority
      />
    </div>
  );
}

export default function Hero() {
  const heroData = {
    title: "Her Şey Takaslanabilir!",
    subtitle:
      "Eşyadan hizmete, yetenekten zamana…\nyepyeni bir takas dünyasına hoş geldin!",
    ctaText: "Hemen Keşfet",
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 min-h-screen overflow-hidden">
      <HeroBackground className="absolute inset-0" />

      <SectionContainer
        background="transparent"
        padding="lg"
        className="relative min-h-screen"
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between min-h-screen py-32">
          <HeroContent
            title={heroData.title}
            subtitle={heroData.subtitle}
            ctaText={heroData.ctaText}
          />
          <HeroImage src="/images/hero.png" alt="Hero Image - Trade Platform" />
        </div>
      </SectionContainer>
    </section>
  );
}
