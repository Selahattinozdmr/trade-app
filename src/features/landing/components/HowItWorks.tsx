import React from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { getHowItWorksSteps } from "@/lib/data";
import type { Step } from "@/types";

interface StepCardProps {
  step: Step;
  index: number;
}

function StepCard({ step, index }: StepCardProps) {
  return (
    <div className="flex flex-col items-center relative">
      <div
        className={`w-24 h-24 rounded-full ${step.background} flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
      >
        <div aria-label={step.label}>{step.icon}</div>
      </div>
      <p className="text-lg font-semibold text-gray-800 max-w-36 leading-tight text-center">
        {step.label}
      </p>

      {/* Optional step number indicator */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
        {index + 1}
      </div>
    </div>
  );
}

interface StepsGridProps {
  steps: Step[];
}

function StepsGrid({ steps }: StepsGridProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-40">
      {steps.map((step, index) => (
        <StepCard key={step.id} step={step} index={index} />
      ))}
    </div>
  );
}

export default function HowItWorks() {
  const steps = getHowItWorksSteps();

  return (
    <SectionContainer id="how" background="white">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-gray-800">
          Nasıl Çalışır?
        </h2>
        <StepsGrid steps={steps} />
      </div>
    </SectionContainer>
  );
}
