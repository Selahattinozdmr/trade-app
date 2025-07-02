import React from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { getCategories } from "@/lib/data";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-110">
        <div aria-label={category.label}>{category.icon}</div>
      </div>
      <p className="font-semibold text-gray-800 text-lg">{category.label}</p>
    </div>
  );
}

interface CategoriesGridProps {
  categories: Category[];
}

const CategoriesGrid = ({ categories }: CategoriesGridProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export default function Categories() {
  const categories = getCategories();

  return (
    <SectionContainer id="categories" background="gray">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-gray-800">
          Popüler Kategoriler
        </h2>
        <CategoriesGrid categories={categories} />
      </div>
    </SectionContainer>
  );
}
