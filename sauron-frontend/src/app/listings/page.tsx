"use client"

import { ProductListingList } from "@/components/product-listings/product-listing-list"

export default function ListingsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Product Listings</h1>
      <ProductListingList />
    </div>
  )
} 