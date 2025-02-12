import React from 'react';
import { Button } from "@/components/ui/button";
import type { Category } from '@/app/(builder)/products/categories';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (categoryId: string) => void;
  onReset: () => void;
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory, onReset }: CategoryNavProps) {
  const renderCategory = (category: Category, depth: number = 0) => {
    const isSelected = selectedCategory?.id === category.id;
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className="space-y-1">
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={`w-full justify-start ${depth > 0 ? 'pl-4' : ''}`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </Button>
        {hasChildren && category.children && (
          <div className="pl-4 space-y-1">
            {category.children.map(child => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
      <div className="space-y-1">
        {categories.map(category => renderCategory(category))}
      </div>
    </div>
  );
} 