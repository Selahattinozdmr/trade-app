import React from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { STATISTICS } from "@/lib/constants";
import type { Statistic } from "@/types";

interface FeatureIconProps {
  children: React.ReactNode;
  label: string;
}

const FeatureIcon = ({ children, label }: FeatureIconProps) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
        {children}
      </div>
      <span className="text-gray-800 font-medium">{label}</span>
    </div>
  );
}

const CheckIcon = () => {
  return (
    <svg
      className="w-5 h-5 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface StatisticCardProps {
  statistic: Statistic;
}

const StatisticCard = ({ statistic }: StatisticCardProps) => {
  return (
    <div className="text-center p-4 bg-orange-50 rounded-lg">
      <div className="text-2xl font-bold text-orange-600 mb-1">
        {statistic.value}
      </div>
      <div className="text-sm text-gray-600">{statistic.label}</div>
    </div>
  );
}

interface StatisticsGridProps {
  statistics: Statistic[];
}

const StatisticsGrid = ({ statistics }: StatisticsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 pt-4">
      {statistics.map((stat) => (
        <StatisticCard key={stat.id} statistic={stat} />
      ))}
    </div>
  );
}

export default function About() {
  const aboutContent = {
    title: "Hakkımızda",
    descriptions: [
      "Takas Go, sürdürülebilirlik ve paylaşımı merkeze alan bir topluluk platformudur. Faydalı olanı değerlendir, ihtiyacını takasla, çevrene katkıda bulun.",
      "Eşyalarınızı, hizmetlerinizi, yeteneklerinizi ve zamanınızı başkalarıyla takas ederek hem ekonomik hem de çevresel faydalar sağlayın.",
      "Takas Go, sürdürülebilirlik ve paylaşımı merkeze alan bir topluluk platformudur. İkinci el ekonomisini destekleyerek tüketimi azaltmayı hedefler.",
      "Binlerce kullanıcımızla birlikte, daha sürdürülebilir bir gelecek için adım atın. Her takas, hem cebinizi hem de gezegenimizi korur.",
    ],
  };

  return (
    <SectionContainer id="about" background="white">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
          {aboutContent.title}
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-center font-semibold">
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            {aboutContent.descriptions[0]}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {aboutContent.descriptions[1]}
          </p>
          <div className="flex justify-around pt-4">
            <FeatureIcon label="Güvenli Takas">
              <CheckIcon />
            </FeatureIcon>
            <FeatureIcon label="Çevre Dostu">
              <CheckIcon />
            </FeatureIcon>
          </div>
        </div>

        <div >
          <p className="text-lg text-gray-700 leading-relaxed">
            {aboutContent.descriptions[2]}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {aboutContent.descriptions[3]}
          </p>
          <StatisticsGrid statistics={STATISTICS} />
        </div>
      </div>
    </SectionContainer>
  );
}
