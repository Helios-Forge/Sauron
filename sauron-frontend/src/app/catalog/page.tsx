import { Metadata } from 'next';
import { MainLayout } from "@/components/layout/MainLayout";
import CatalogContent from "@/components/catalog/CatalogContent";

export const metadata: Metadata = {
  title: "Products Catalog - GunGuru",
  description: "Browse our extensive catalog of firearm parts and accessories with detailed specifications and price comparisons.",
};

export default function CatalogPage() {
  return (
    <MainLayout>
      <CatalogContent />
    </MainLayout>
  );
} 