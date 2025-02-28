import { MainLayout } from "@/components/layout/MainLayout";
import { Suspense } from "react";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import ProductFilters from "@/components/catalog/ProductFilters";

export const metadata = {
  title: "Products Catalog - GunGuru",
  description: "Browse our extensive catalog of firearm parts and accessories with detailed specifications and price comparisons.",
};

export default function CatalogPage() {
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar with filters */}
            <div className="w-full md:w-1/4">
              <ProductFilters />
            </div>
            
            {/* Main content with product table */}
            <div className="w-full md:w-3/4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Products Catalog
              </h1>
              <Suspense fallback={<div className="text-center py-12">Loading products...</div>}>
                <ProductCatalog />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 