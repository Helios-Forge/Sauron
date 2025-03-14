"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Part, getParts } from '@/lib/api';

interface Seller {
  name: string;
  price: number;
  shipping: number;
  logo: string;
}

interface ProductCatalogProps {
  componentFilter?: string;
  isAssembly?: boolean;
  onSelectProduct?: (productId: string) => void;
  selectedProductId?: string | null;
  returnToBuilder?: boolean;
  category_id?: number;
  filters?: {
    subcategories: string[];
    manufacturers: string[];
    compatibilities: string[];
    priceRange: [number, number];
    isAssembly?: boolean;
  };
}

export default function ProductCatalog({ 
  componentFilter, 
  isAssembly = false,
  onSelectProduct,
  selectedProductId,
  returnToBuilder = false,
  category_id,
  filters
}: ProductCatalogProps) {
  const [products, setProducts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partsCache, setPartsCache] = useState<Part[] | null>(null);

  // Fetch all parts once
  useEffect(() => {
    let isMounted = true;

    const fetchAllParts = async () => {
      if (partsCache !== null) return; // Only fetch if we don't have a cache
      
      try {
        setLoading(true);
        const parts = await getParts();
        if (isMounted) {
          setPartsCache(parts);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        if (isMounted) {
          setError('Failed to load products. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchAllParts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    if (!partsCache) return; // Wait until we have the parts

    let filteredParts = [...partsCache];
    
    // Filter by category_id (new schema) if specified
    if (category_id) {
      console.log(`Filtering by category_id: ${category_id}`);
      
      filteredParts = filteredParts.filter(part => {
        // Direct match on category ID
        return part.part_category_id === category_id;
      });
    }
    // Filter by component using its category_id
    else if (filters && filters.subcategories && filters.subcategories.length > 0) {
      console.log(`Filtering by category IDs: ${filters.subcategories}`);
      
      filteredParts = filteredParts.filter(part => {
        // Only match based on part_category_id
        return part.part_category_id && filters.subcategories.includes(part.part_category_id.toString());
      });
    }
    
    // Filter by assembly status
    if (isAssembly !== undefined) {
      filteredParts = filteredParts.filter(part => part.is_prebuilt === isAssembly);
    }
    
    // Apply additional filters if provided
    if (filters) {
      // Filter by manufacturers
      if (filters.manufacturers && filters.manufacturers.length > 0) {
        filteredParts = filteredParts.filter(part => 
          filters.manufacturers.includes(part.manufacturer_id.toString())
        );
      }
      
      // Filter by compatibilities
      if (filters.compatibilities && filters.compatibilities.length > 0) {
        filteredParts = filteredParts.filter(part => {
          if (!part.compatible_models || !Array.isArray(part.compatible_models)) {
            return false;
          }
          
          return part.compatible_models.some(compatModel => 
            typeof compatModel === 'object' && 
            compatModel.model && 
            filters.compatibilities.includes(compatModel.model)
          );
        });
      }
      
      // Filter by price range
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        filteredParts = filteredParts.filter(part => {
          // If part has a price property
          if ('price' in part && typeof part.price === 'number') {
            return part.price >= minPrice && part.price <= maxPrice;
          }
          return true; // Include parts without price for now
        });
      }
    }
    
    setProducts(filteredParts);
  }, [partsCache, componentFilter, isAssembly, filters, category_id]);

  if (loading && !partsCache) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          {error}
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
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Compatibility</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow 
              key={product.id} 
              product={product} 
              onSelectProduct={onSelectProduct}
              isSelected={selectedProductId === product.id.toString()}
              returnToBuilder={returnToBuilder}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ProductRow = ({ 
  product, 
  onSelectProduct,
  isSelected,
  returnToBuilder
}: { 
  product: Part;
  onSelectProduct?: (productId: string) => void;
  isSelected?: boolean;
  returnToBuilder?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectProduct = useCallback(() => {
    if (onSelectProduct) {
      onSelectProduct(product.id.toString());
    }
  }, [onSelectProduct, product.id]);

  // Get a list of compatible models for display
  const compatibleModels = useMemo(() => {
    return product.compatible_models
      ? product.compatible_models
          .filter(model => typeof model === 'object' && model.model)
          .map(model => (model as any).model)
          .join(', ')
      : 'Not specified';
  }, [product.compatible_models]);

  return (
    <>
      <tr className={`${isSelected ? 'bg-blue-50 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'} border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}>
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 relative bg-gray-200 rounded">
              {/* If product has an image property, display it */}
              {(product as any).image && (
                <Image
                  src={(product as any).image}
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
              {product.is_prebuilt && (
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
        <td className="px-6 py-4">
          {product.category}
          {product.subcategory && <span className="block text-xs text-gray-500">{product.subcategory}</span>}
        </td>
        <td className="px-6 py-4">
          <div className="max-w-xs truncate" title={compatibleModels}>
            {compatibleModels}
          </div>
        </td>
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
          <td colSpan={4} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-sm">{product.description || 'No description available'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Compatibility</h4>
                <p className="text-sm">{compatibleModels}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sub-Components</h4>
                {product.sub_components && product.sub_components.length > 0 ? (
                  <ul className="list-disc list-inside text-sm">
                    {product.sub_components.map((subComponent, index) => (
                      <li key={index}>{subComponent.name} ({subComponent.type})</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">No sub-components</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
} 