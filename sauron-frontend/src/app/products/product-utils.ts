import { Product } from './mock-data';
import { Category, findCategoryByPath } from './categories';

// Filter products by category path
export function filterProductsByCategory(
  products: Product[],
  categoryPath: string[]
): Product[] {
  if (!categoryPath || categoryPath.length === 0) {
    return products;
  }

  // Find the category object based on the path
  const category = findCategoryByPath(categoryPath);
  if (!category) {
    return products;
  }

  // Helper function to check if a product belongs to a category or any of its subcategories
  const productBelongsToCategory = (product: Product, category: Category): boolean => {
    // Direct match with the category
    if (product.category === category.id || product.subCategory === category.id) {
      return true;
    }

    // Check subcategories recursively
    if (category.subcategories && category.subcategories.length > 0) {
      return category.subcategories.some(subcat => productBelongsToCategory(product, subcat));
    }

    return false;
  };

  return products.filter(product => productBelongsToCategory(product, category));
}

// Filter products by price range
export function filterProductsByPrice(
  products: Product[],
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): Product[] {
  return products.filter(product => product.price >= min && product.price <= max);
}

// Filter products by brand
export function filterProductsByBrand(
  products: Product[],
  brands: string[]
): Product[] {
  if (!brands || brands.length === 0) {
    return products;
  }
  return products.filter(product => brands.includes(product.brand));
}

// Filter products by compatibility
export function filterProductsByCompatibility(
  products: Product[],
  compatibilities: string[]
): Product[] {
  if (!compatibilities || compatibilities.length === 0) {
    return products;
  }
  return products.filter(product => 
    product.compatibility.some(comp => compatibilities.includes(comp))
  );
}

// Filter products by availability
export function filterProductsByAvailability(
  products: Product[],
  inStockOnly: boolean
): Product[] {
  if (!inStockOnly) {
    return products;
  }
  return products.filter(product => product.inStock);
}

// Filter products by rating
export function filterProductsByRating(
  products: Product[],
  minRating?: number
): Product[] {
  if (minRating === undefined) {
    return products;
  }
  return products.filter(product => product.rating >= minRating);
}

// Filter products by search term
export function filterProductsBySearchTerm(
  products: Product[],
  searchTerm: string
): Product[] {
  if (!searchTerm) {
    return products;
  }
  
  const term = searchTerm.toLowerCase();
  return products.filter(
    product => 
      product.name.toLowerCase().includes(term) || 
      product.description.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term)
  );
}

// Sort products
export function sortProducts(
  products: Product[],
  sortBy: string
): Product[] {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-low-high':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-high-low':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name-a-z':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-z-a':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    case 'rating-high-low':
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    case 'newest':
      // In a real app, you would sort by date added
      return sortedProducts;
    default:
      return sortedProducts;
  }
}

// Apply all filters at once
export function applyAllFilters(
  products: Product[],
  filters: {
    categoryPath?: string[];
    searchTerm?: string;
    priceRange?: [number, number];
    brands?: string[];
    compatibilities?: string[];
    inStockOnly?: boolean;
    minRating?: number;
    sortBy?: string;
  }
): Product[] {
  let filteredProducts = [...products];
  
  // Apply category filter
  if (filters.categoryPath && filters.categoryPath.length > 0) {
    filteredProducts = filterProductsByCategory(filteredProducts, filters.categoryPath);
  }
  
  // Apply search term filter
  if (filters.searchTerm) {
    filteredProducts = filterProductsBySearchTerm(filteredProducts, filters.searchTerm);
  }
  
  // Apply price range filter
  if (filters.priceRange) {
    filteredProducts = filterProductsByPrice(filteredProducts, filters.priceRange[0], filters.priceRange[1]);
  }
  
  // Apply brand filter
  if (filters.brands && filters.brands.length > 0) {
    filteredProducts = filterProductsByBrand(filteredProducts, filters.brands);
  }
  
  // Apply compatibility filter
  if (filters.compatibilities && filters.compatibilities.length > 0) {
    filteredProducts = filterProductsByCompatibility(filteredProducts, filters.compatibilities);
  }
  
  // Apply in-stock filter
  if (filters.inStockOnly) {
    filteredProducts = filterProductsByAvailability(filteredProducts, filters.inStockOnly);
  }
  
  // Apply rating filter
  if (filters.minRating !== undefined) {
    filteredProducts = filterProductsByRating(filteredProducts, filters.minRating);
  }
  
  // Apply sorting
  if (filters.sortBy) {
    filteredProducts = sortProducts(filteredProducts, filters.sortBy);
  }
  
  return filteredProducts;
}
