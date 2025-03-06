"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import CatalogContent from "@/components/catalog/CatalogContent";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const componentId = searchParams.get('component') || searchParams.get('componentFilter');
  const isAssemblyParam = searchParams.get('isAssembly');
  const isAssembly = isAssemblyParam !== null ? isAssemblyParam === 'true' : undefined;
  const firearmId = searchParams.get('firearmId');
  const returnToBuilder = searchParams.get('returnToBuilder') === 'true';
  const compatibility = searchParams.get('compatibility') || searchParams.get('modelName');
  const categoryId = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined;
  
  // State for selected product
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Handle product selection with useCallback to avoid recreation on renders
  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProductId(productId);
    
    // If we're selecting a product to return to the builder, redirect back
    if (returnToBuilder && firearmId && componentId) {
      console.log('Redirecting back to builder with params:', {
        firearmId,
        component_category: componentId, // This is actually the category from our URL
        selected_part_id: productId,
        isAssembly,
        categoryId
      });
      
      // We're getting the component CATEGORY as componentId, not a numeric ID
      // For now, let's pass it back correctly as the category
      const isAssemblyParam = isAssembly !== undefined ? `&isAssembly=${isAssembly}` : '';
      const categoryIdParam = categoryId !== undefined ? `&category_id=${categoryId}` : '';
      
      router.push(`/builder?firearmId=${firearmId}&component_category=${componentId}&selected_part_id=${productId}${isAssemblyParam}${categoryIdParam}`);
    }
  }, [returnToBuilder, firearmId, componentId, isAssembly, categoryId, router]);
  
  return (
    <MainLayout>
      <CatalogContent 
        componentId={componentId || undefined}
        isAssembly={isAssembly}
        onSelectProduct={handleSelectProduct}
        selectedProductId={selectedProductId}
        returnToBuilder={returnToBuilder}
        compatibility={compatibility || undefined}
        categoryId={categoryId}
      />
    </MainLayout>
  );
} 