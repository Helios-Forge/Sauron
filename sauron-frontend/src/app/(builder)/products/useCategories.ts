import { useState, useCallback } from 'react';
import { categoryConfig } from './category-config';
import type { Category } from './categories';

export function useCategories() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const setSelectedCategoryById = useCallback((categoryId: string) => {
    const findCategory = (categories: Category[]): Category | undefined => {
      for (const category of categories) {
        if (category.id === categoryId) {
          return category;
        }
        if (category.children) {
          const found = findCategory(category.children);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    };

    const category = findCategory(categoryConfig);
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  const getBreadcrumb = useCallback((category: Category | null): Category[] => {
    if (!category) {
      return [];
    }

    const findPath = (
      categories: Category[],
      targetId: string,
      path: Category[] = []
    ): Category[] | null => {
      for (const cat of categories) {
        if (cat.id === targetId) {
          return [...path, cat];
        }
        if (cat.children) {
          const found = findPath(cat.children, targetId, [...path, cat]);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const path = findPath(categoryConfig, category.id);
    return path || [category];
  }, []);

  const filterProductsByCategory = useCallback(
    (products: any[]) => {
      if (!selectedCategory) {
        return products;
      }
      return products.filter(
        (product) =>
          product.category === selectedCategory.id ||
          (selectedCategory.children &&
            selectedCategory.children.some((child) => child.id === product.category))
      );
    },
    [selectedCategory]
  );

  const resetCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  return {
    categories: categoryConfig,
    selectedCategory,
    breadcrumb: selectedCategory ? getBreadcrumb(selectedCategory) : [],
    setSelectedCategoryById,
    filterProductsByCategory,
    resetCategory,
  };
} 