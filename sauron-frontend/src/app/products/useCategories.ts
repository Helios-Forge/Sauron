import { useState, useEffect, useCallback } from 'react';
import { Category } from './categories';
import { categoryConfig } from './category-config';
import { findCategory, getAllChildCategories } from './categories';
import { Product } from './mock-data';

interface UseCategoriesResult {
  categories: Category[];
  selectedCategory: Category | null;
  breadcrumb: Category[];
  setSelectedCategoryById: (id: string) => void;
  filterProductsByCategory: (products: Product[]) => Product[];
  resetCategory: () => void;
}

export function useCategories(): UseCategoriesResult {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  
  // Debug logging for initial setup
  console.log('[DEBUG] Initializing useCategories hook');
  
  const setSelectedCategoryById = useCallback((id: string) => {
    console.log(`[DEBUG] Setting selected category by id: ${id}`);
    const category = findCategory(categoryConfig, id);
    
    if (category) {
      console.log(`[DEBUG] Found category: ${category.name}`);
      setSelectedCategory(category);
      
      // Build breadcrumb by traversing up the tree
      let current = category;
      const newBreadcrumb: Category[] = [current];
      
      while (current.parentId) {
        const parent = findCategory(categoryConfig, current.parentId);
        if (parent) {
          newBreadcrumb.unshift(parent);
          current = parent;
        } else {
          break;
        }
      }
      
      console.log(`[DEBUG] Setting breadcrumb:`, newBreadcrumb.map(c => c.name));
      setBreadcrumb(newBreadcrumb);
    } else {
      console.log(`[DEBUG] Category not found: ${id}`);
      setSelectedCategory(null);
      setBreadcrumb([]);
    }
  }, []);
  
  const filterProductsByCategory = useCallback((products: Product[]): Product[] => {
    if (!selectedCategory) {
      console.log('[DEBUG] No category selected, returning all products');
      return products;
    }
    
    // Get all child category IDs including the selected category
    const categoryIds = getAllChildCategories(selectedCategory);
    console.log(`[DEBUG] Filtering by categories:`, categoryIds);
    
    return products.filter(product => {
      const matchesCategory = categoryIds.includes(product.category);
      const matchesSubCategory = product.subCategory ? categoryIds.includes(product.subCategory) : false;
      return matchesCategory || matchesSubCategory;
    });
  }, [selectedCategory]);
  
  const resetCategory = useCallback(() => {
    console.log('[DEBUG] Resetting category selection');
    setSelectedCategory(null);
    setBreadcrumb([]);
  }, []);
  
  return {
    categories: categoryConfig,
    selectedCategory,
    breadcrumb,
    setSelectedCategoryById,
    filterProductsByCategory,
    resetCategory,
  };
} 