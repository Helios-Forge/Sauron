"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import CatalogContent from "@/components/catalog/CatalogContent";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const componentId = searchParams.get('component');
  const isAssembly = searchParams.get('isAssembly') === 'true';
  const firearmId = searchParams.get('firearmId');
  const returnToBuilder = searchParams.get('returnToBuilder') === 'true';
  
  // State for selected product
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Handle product selection with useCallback to avoid recreation on renders
  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProductId(productId);
    
    // If we're selecting a product to return to the builder, redirect back
    if (returnToBuilder && firearmId && componentId) {
      router.push(`/builder?firearmId=${firearmId}&componentId=${componentId}&productId=${productId}&isAssembly=${isAssembly}`);
    }
  }, [returnToBuilder, firearmId, componentId, isAssembly, router]);

  return (
    <MainLayout>
      <CatalogContent 
        componentId={componentId || undefined}
        isAssembly={isAssembly}
        onSelectProduct={handleSelectProduct}
        selectedProductId={selectedProductId}
        returnToBuilder={returnToBuilder}
      />
    </MainLayout>
  );
} 