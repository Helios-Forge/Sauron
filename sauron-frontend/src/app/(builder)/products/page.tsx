"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CategoryNav } from "@/components/CategoryNav"
import { useCategories } from "./useCategories"
import { useBuilderContext } from "@/contexts/BuilderContext"
import { useProductListings } from "@/lib/hooks/use-product-listings"
import type { SubcomponentPart, AssemblyPart, StandalonePart } from "@/types/builder"
import { bcgAssembly, bcgSubcomponents } from "@/lib/builder/mockData"

export default function ProductsPage() {
  const router = useRouter();
  const { addPart, replaceSubcomponent, addAssembly } = useBuilderContext();
  const searchParams = useSearchParams();
  const {
    categories,
    selectedCategory,
    breadcrumb,
    setSelectedCategoryById,
    filterProductsByCategory,
    resetCategory
  } = useCategories();

  // Get products from the backend
  const { data: products, isLoading, error } = useProductListings();

  // Initialize category from URL if present
  useEffect(() => {
    const categoryId = searchParams.get('category');
    if (categoryId) {
      console.log(`[DEBUG] Initializing category from URL: ${categoryId}`);
      setSelectedCategoryById(categoryId);
    }
  }, [searchParams, setSelectedCategoryById]);

  // Handle adding product to build
  const handleAddToBuild = (product: any) => {
    console.log('[DEBUG] handleAddToBuild called with:', {
      product,
      category: selectedCategory,
      currentUrl: window.location.href,
      urlParams: {
        returnToBuilder: searchParams.get('returnToBuilder'),
        parentGroupId: searchParams.get('parentGroupId'),
        category: searchParams.get('category')
      }
    });
    
    if (!selectedCategory) {
      console.error('[DEBUG] No category selected');
      alert('Please select a category before adding to build');
      return;
    }

    const isPreAssembled = product.category === 'bcg';
    const isReplacingSubComponent = searchParams.get('returnToBuilder') === 'true';
    const parentGroupId = searchParams.get('parentGroupId');

    try {
      // Convert product to the appropriate Part type
      if (isReplacingSubComponent && parentGroupId) {
        // Find the matching subcomponent from mock data
        const mockSubcomponent = bcgSubcomponents.find(s => s.categoryId === selectedCategory.id);
        const subcomponentPart: SubcomponentPart = mockSubcomponent ? {
          ...mockSubcomponent,
          id: product.id.toString(),
          name: product.name || product.part?.name || '',
          price: product.price,
          description: product.description || '',
        } : {
          id: product.id.toString(),
          type: 'SUBCOMPONENT',
          name: product.name || product.part?.name || '',
          categoryId: selectedCategory.id,
          price: product.price,
          description: product.description || '',
          isReplaceable: true,
        };

        console.log('[DEBUG] Replacing subcomponent:', subcomponentPart);
        replaceSubcomponent(selectedCategory.id, subcomponentPart);
      } else if (isPreAssembled) {
        // For BCG assembly, use the predefined assembly from mock data
        const assemblyPart: AssemblyPart = {
          ...bcgAssembly,
          id: product.id.toString(),
          name: product.name || product.part?.name || '',
          price: product.price,
          description: product.description || '',
          subcomponents: bcgAssembly.subcomponents.map(subConfig => ({
            categoryId: subConfig.categoryId,
            partId: `${product.id}-${subConfig.categoryId}`,
            isReplaceable: subConfig.isReplaceable
          }))
        };

        console.log('[DEBUG] Adding assembly with mock data:', assemblyPart);
        addAssembly(assemblyPart);
      } else {
        // For regular standalone parts
        const standalonePart: StandalonePart = {
          id: product.id.toString(),
          type: 'STANDALONE',
          name: product.name || product.part?.name || '',
          categoryId: selectedCategory.id,
          price: product.price,
          description: product.description || '',
        };

        console.log('[DEBUG] Adding standalone part:', standalonePart);
        addPart(selectedCategory.id, standalonePart);
      }

      console.log('[DEBUG] Successfully added part/assembly, redirecting to builder');
      router.push('/builder');
    } catch (error) {
      console.error('[DEBUG] Error adding part/assembly:', error);
      alert('There was an error adding the part to your build. Please try again.');
    }
  };

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products?.filter(product => 
        product.part?.category === selectedCategory.id ||
        (selectedCategory.children?.some(child => 
          product.part?.category === child.id
        ))
      )
    : products;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => router.push('/builder')}>Back to Builder</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategoryById}
            onReset={resetCategory}
          />
        </div>

        <div className="md:col-span-3">
          {isLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading products. Please try again.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts?.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.part?.name || 'Unnamed Product'}</CardTitle>
                    <CardDescription>SKU: {product.sku}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">
                        ${(product.price ?? 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Seller: {product.seller?.name}
                      </p>
                      <Badge className={
                        product.availability === 'in_stock' 
                          ? 'bg-green-100 text-green-800'
                          : product.availability === 'out_of_stock'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {product.availability}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleAddToBuild(product)}
                      disabled={product.availability === 'out_of_stock'}
                    >
                      Add to Build
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 