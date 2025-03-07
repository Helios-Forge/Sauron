"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import CatalogContent from "@/components/catalog/CatalogContent";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extract parameters from URL
  const componentId = searchParams.get('componentId');
  const isAssembly = searchParams.get('isAssembly') === 'true';
  const firearmId = searchParams.get('firearmId');
  const returnToBuilder = searchParams.get('returnToBuilder') === 'true';
  const compatibility = searchParams.get('compatibility');
  const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId') || '0') : undefined;
  const component = searchParams.get('component'); // Legacy parameter
  
  // State to track selected product
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Handle product selection
  const handleSelectProduct = (productId: string) => {
    console.log(`Selected product ID: ${productId}`);
    setSelectedProductId(productId);
    
    // If we're returning to builder, construct the URL with the selected part
    if (returnToBuilder && firearmId) {
      const returnParams = new URLSearchParams({
        selectedPart: productId,
        componentId: componentId || '0',
        isAssembly: isAssembly ? 'true' : 'false'
      });
      
      const builderUrl = `/builder/${firearmId}?${returnParams.toString()}`;
      console.log(`Returning to builder: ${builderUrl}`);
      router.push(builderUrl);
    }
  };
  
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