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
  categoryId?: number;
}

interface FilterState {
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
  compatibility,
  categoryId
}: CatalogContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageTitle, setPageTitle] = useState('Product Catalog');
  const [filters, setFilters] = useState<FilterState>(() => {
    // Initialize filters only once when the component mounts
    const initialFilters: FilterState = {
      subcategories: [],
      manufacturers: [],
      compatibilities: compatibility ? [compatibility] : [],
      priceRange: [0, 2000],
      isAssembly: isAssembly
    };
    return initialFilters;
  });
  const [isFiltering, setIsFiltering] = useState(false);

  // Format page title based on component ID
  useEffect(() => {
    if (componentId) {
      setPageTitle(`${componentId}${isAssembly ? ' Assemblies' : ''}`);
    } else {
      setPageTitle('Product Catalog');
    }
  }, [componentId, isAssembly]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <ProductFilters 
              initialComponent={componentId}
              isAssembly={isAssembly}
              onFilterChange={handleFilterChange}
              setIsFiltering={setIsFiltering}
            />
          </div>
        </div>
        
        {/* Product listing */}
        <div className="lg:w-3/4">
          <ProductCatalog 
            componentFilter={componentId}
            isAssembly={isAssembly}
            onSelectProduct={onSelectProduct}
            selectedProductId={selectedProductId}
            returnToBuilder={returnToBuilder}
            category_id={categoryId}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
} 