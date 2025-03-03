"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCatalog from '@/components/catalog/ProductCatalog';
import ProductFilters from '@/components/catalog/ProductFilters';

export default function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const componentId = searchParams.get('component');
  const isAssembly = searchParams.get('isAssembly') === 'true';
  const firearmId = searchParams.get('firearmId');
  const returnToBuilder = searchParams.get('returnToBuilder') === 'true';
  
  // State for selected product
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Handle product selection
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    
    // If we're selecting a product to return to the builder, redirect back
    if (returnToBuilder && firearmId && componentId) {
      router.push(`/builder?firearmId=${firearmId}&componentId=${componentId}&productId=${productId}&isAssembly=${isAssembly}`);
    }
  };
  
  // Set page title based on component
  let pageTitle = "Products Catalog";
  if (componentId) {
    // Format the component ID for display (e.g., "bolt-carrier-group" -> "Bolt Carrier Group")
    const formattedComponent = componentId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    pageTitle = isAssembly 
      ? `${formattedComponent} Assemblies` 
      : formattedComponent;
  }
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="w-full md:w-1/4">
            <ProductFilters 
              initialComponent={componentId || undefined}
              isAssembly={isAssembly}
            />
          </div>
          
          {/* Main content with product table */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {pageTitle}
              </h1>
              
              {returnToBuilder && (
                <button
                  onClick={() => router.back()}
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Back to Builder
                </button>
              )}
            </div>
            
            <ProductCatalog 
              componentFilter={componentId || undefined}
              isAssembly={isAssembly}
              onSelectProduct={handleSelectProduct}
              selectedProductId={selectedProductId}
              returnToBuilder={returnToBuilder}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 