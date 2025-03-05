"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCatalog from './ProductCatalog';
import ProductFilters from './ProductFilters';

interface CatalogContentProps {
  componentId?: string;
  isAssembly?: boolean;
  onSelectProduct?: (productId: string) => void;
  selectedProductId?: string | null;
  returnToBuilder?: boolean;
  compatibility?: string;
}

interface FilterState {
  category: string | null;
  subcategories: string[];
  manufacturers: string[];
  compatibilities: string[];
  priceRange: [number, number];
  isAssembly?: boolean;
}

export default function CatalogContent({ 
  componentId, 
  isAssembly,
  onSelectProduct,
  selectedProductId,
  returnToBuilder = false,
  compatibility
}: CatalogContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageTitle, setPageTitle] = useState('Product Catalog');
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    subcategories: [],
    manufacturers: [],
    compatibilities: compatibility ? [compatibility] : [],
    priceRange: [0, 1000],
    isAssembly
  });

  // Format page title based on component ID
  useEffect(() => {
    if (componentId) {
      // Convert kebab-case to Title Case
      const formattedComponent = componentId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      setPageTitle(`${formattedComponent} ${isAssembly ? 'Assemblies' : 'Parts'}`);
    } else {
      setPageTitle('Product Catalog');
    }
  }, [componentId, isAssembly]);

  // Handle filter changes - memoized to prevent recreation on renders
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    // Update URL with filter parameters (optional)
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{pageTitle}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ProductFilters 
            initialComponent={componentId} 
            isAssembly={isAssembly}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        <div className="md:col-span-3">
          <ProductCatalog 
            componentFilter={componentId}
            isAssembly={isAssembly}
            onSelectProduct={onSelectProduct}
            selectedProductId={selectedProductId}
            returnToBuilder={returnToBuilder}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
} 