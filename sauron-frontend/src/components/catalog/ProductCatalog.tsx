"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Seller {
  name: string;
  price: number;
  shipping: number;
  logo: string;
}

interface Product {
  id: string;
  name: string;
  manufacturer: string;
  rating: number;
  reviewCount: number;
  image: string;
  price: number;
  isAssembly?: boolean;
  componentType?: string;
  sellers: Seller[];
}

interface ProductCatalogProps {
  componentFilter?: string;
  isAssembly?: boolean;
  onSelectProduct?: (productId: string) => void;
  selectedProductId?: string | null;
  returnToBuilder?: boolean;
}

// This would be replaced with actual API call
function getProducts(componentFilter?: string, isAssembly?: boolean): Product[] {
  // In a real implementation, this would be:
  // const response = await fetch(`/api/listings?component=${componentFilter}&isAssembly=${isAssembly}`);
  // return response.json();
  
  // For now, return mock data if we have a component filter
  if (componentFilter) {
    // Generate some mock products for the component
    return Array.from({ length: 5 }, (_, i) => ({
      id: `${componentFilter}-${i + 1}`,
      name: `${componentFilter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} ${isAssembly ? 'Assembly' : 'Part'} ${i + 1}`,
      manufacturer: ['Aero Precision', 'Bravo Company', 'Daniel Defense', 'Geissele', 'Magpul'][i % 5],
      rating: 4 + (i % 2) * 0.5,
      reviewCount: 50 + i * 20,
      image: '/placeholder.jpg',
      price: isAssembly ? 150 + i * 25 : 50 + i * 15,
      isAssembly: isAssembly,
      componentType: componentFilter,
      sellers: [
        {
          name: 'GunBroker',
          price: isAssembly ? 150 + i * 25 : 50 + i * 15,
          shipping: 10.00,
          logo: '/placeholder-logo.jpg'
        },
        {
          name: 'Brownells',
          price: isAssembly ? 160 + i * 25 : 55 + i * 15,
          shipping: 0,
          logo: '/placeholder-logo.jpg'
        },
        {
          name: 'Palmetto State Armory',
          price: isAssembly ? 155 + i * 25 : 52 + i * 15,
          shipping: 7.50,
          logo: '/placeholder-logo.jpg'
        }
      ]
    }));
  }
  
  // Return empty array for now
  return [];
}

export default function ProductCatalog({ 
  componentFilter, 
  isAssembly = false,
  onSelectProduct,
  selectedProductId,
  returnToBuilder = false
}: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products when component mounts or filters change
    const fetchedProducts = getProducts(componentFilter, isAssembly);
    setProducts(fetchedProducts);
    setLoading(false);
  }, [componentFilter, isAssembly]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading products...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No products found. Please try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Product</th>
            <th scope="col" className="px-6 py-3">Manufacturer</th>
            <th scope="col" className="px-6 py-3">Rating</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow 
              key={product.id} 
              product={product} 
              onSelectProduct={onSelectProduct}
              isSelected={selectedProductId === product.id}
              returnToBuilder={returnToBuilder}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({ 
  product, 
  onSelectProduct,
  isSelected,
  returnToBuilder
}: { 
  product: Product;
  onSelectProduct?: (productId: string) => void;
  isSelected?: boolean;
  returnToBuilder?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cheapestSeller = product.sellers.sort((a, b) => a.price - b.price)[0];

  const handleSelectProduct = () => {
    if (onSelectProduct) {
      onSelectProduct(product.id);
    }
  };

  return (
    <>
      <tr className={`${isSelected ? 'bg-blue-50 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'} border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}>
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 relative bg-gray-200 rounded">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              )}
            </div>
            <div>
              <Link href={`/catalog/${product.id}`} className="hover:underline">
                {product.name}
              </Link>
              {product.isAssembly && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                  Assembly
                </span>
              )}
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-blue-600 dark:text-blue-400 text-xs"
              >
                {isExpanded ? 'Hide details' : 'Show details'}
              </button>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">{product.manufacturer}</td>
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`}
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="currentColor" 
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
              ))}
            </div>
            <span className="ml-1 text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
          </div>
        </td>
        <td className="px-6 py-4">${product.price.toFixed(2)}</td>
        <td className="px-6 py-4">
          {returnToBuilder ? (
            <button 
              onClick={handleSelectProduct}
              className={`font-medium rounded-lg text-sm px-4 py-2 ${
                isSelected 
                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
              }`}
            >
              {isSelected ? 'Selected' : 'Select Part'}
            </button>
          ) : (
            <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              Add to Builder
            </button>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50 dark:bg-gray-700">
          <td colSpan={5} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Specifications</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Specification 1</li>
                  <li>Specification 2</li>
                  <li>Specification 3</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Compatibility</h4>
                <p className="text-sm">Compatible with AR-15, M4, M16 platforms</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Price Comparison</h4>
                <ul className="space-y-2">
                  {product.sellers.slice(0, 3).map((seller, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{seller.name}</span>
                      <span>${seller.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
} 