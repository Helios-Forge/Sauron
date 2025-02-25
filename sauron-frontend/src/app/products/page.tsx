"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Product,
  Vendor,
  productsData,
  productCategories,
  productBrands,
  filterProductsByCategory,
  filterProductsByPrice,
  filterProductsByBrand,
  filterProductsByCompatibility,
  filterProductsByAvailability,
  filterProductsByRating,
  sortProducts
} from "./mock-data"

export default function ProductsPage() {
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("price-low-high");
  const [selectedCompatibility, setSelectedCompatibility] = useState<string[]>([]);
  
  // Product comparison state
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Filtered and sorted products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData);
  
  // Expanded product rows state
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  
  // Product comparisons
  const addToCompare = (product: Product) => {
    if (compareProducts.length < 3 && !compareProducts.some(p => p.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
    }
  };
  
  const removeFromCompare = (productId: string) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  };
  
  const clearComparison = () => {
    setCompareProducts([]);
  };
  
  // Toggle expanded row
  const toggleExpandRow = (productId: string) => {
    if (expandedProductIds.includes(productId)) {
      setExpandedProductIds(expandedProductIds.filter(id => id !== productId));
    } else {
      setExpandedProductIds([...expandedProductIds, productId]);
    }
  };
  
  // Apply filters
  useEffect(() => {
    let result = productsData;
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)
      );
    }
    
    // Apply category filters
    result = filterProductsByCategory(
      result, 
      selectedCategory === "all" ? undefined : selectedCategory, 
      selectedSubCategory === "all" ? undefined : selectedSubCategory
    );
    
    // Apply price range filter
    result = filterProductsByPrice(result, priceRange[0], priceRange[1]);
    
    // Apply brand filter
    result = filterProductsByBrand(result, selectedBrands);
    
    // Apply compatibility filter
    result = filterProductsByCompatibility(result, selectedCompatibility);
    
    // Apply in-stock filter
    result = filterProductsByAvailability(result, inStockOnly);
    
    // Apply rating filter
    result = filterProductsByRating(result, minRating);
    
    // Apply sorting
    result = sortProducts(result, sortBy);
    
    setFilteredProducts(result);
  }, [
    searchTerm, 
    selectedCategory, 
    selectedSubCategory, 
    priceRange, 
    selectedBrands, 
    selectedCompatibility,
    inStockOnly, 
    minRating, 
    sortBy
  ]);
  
  // Get all available compatibility options from products
  const getCompatibilityOptions = () => {
    const options = new Set<string>();
    productsData.forEach(product => {
      product.compatibility.forEach(option => options.add(option));
    });
    return Array.from(options).sort();
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setPriceRange([0, 2000]);
    setSelectedBrands([]);
    setSelectedCompatibility([]);
    setInStockOnly(false);
    setMinRating(undefined);
    setSortBy("price-low-high");
  };
  
  // Find best vendor price
  const getBestVendorPrice = (vendors: Vendor[]) => {
    const inStockVendors = vendors.filter(v => v.inStock);
    if (inStockVendors.length === 0) return null;
    
    return inStockVendors.reduce((lowest, vendor) => 
      vendor.price < lowest.price ? vendor : lowest
    , inStockVendors[0]);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products Catalog</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset All
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search</Label>
                <Input 
                  id="search" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value: string) => {
                    setSelectedCategory(value);
                    setSelectedSubCategory("all");
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {productCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sub-Category Filter */}
              {selectedCategory !== "all" && (
                <div>
                  <Label htmlFor="subcategory">Sub-Category</Label>
                  <Select 
                    value={selectedSubCategory} 
                    onValueChange={setSelectedSubCategory}
                  >
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="All Sub-Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sub-Categories</SelectItem>
                      {productCategories
                        .find(category => category.value === selectedCategory)
                        ?.subCategories.map(subCategory => (
                          <SelectItem key={subCategory.value} value={subCategory.value}>
                            {subCategory.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Price Range */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Price Range</Label>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 2000]}
                  max={2000}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="my-4"
                />
              </div>
              
              {/* Brand Filter */}
              <Accordion type="single" collapsible defaultValue="brands">
                <AccordionItem value="brands">
                  <AccordionTrigger>Brands</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {productBrands.map(brand => (
                        <div key={brand.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`brand-${brand.value}`} 
                            checked={selectedBrands.includes(brand.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBrands([...selectedBrands, brand.value]);
                              } else {
                                setSelectedBrands(selectedBrands.filter(b => b !== brand.value));
                              }
                            }}
                          />
                          <label
                            htmlFor={`brand-${brand.value}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Compatibility Filter */}
              <Accordion type="single" collapsible defaultValue="compatibility">
                <AccordionItem value="compatibility">
                  <AccordionTrigger>Compatibility</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {getCompatibilityOptions().map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`compatibility-${option}`} 
                            checked={selectedCompatibility.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCompatibility([...selectedCompatibility, option]);
                              } else {
                                setSelectedCompatibility(selectedCompatibility.filter(o => o !== option));
                              }
                            }}
                          />
                          <label
                            htmlFor={`compatibility-${option}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Availability Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  checked={inStockOnly}
                  onCheckedChange={(checked) => setInStockOnly(!!checked)}
                />
                <label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  In Stock Only
                </label>
              </div>
              
              {/* Minimum Rating */}
              <div>
                <Label htmlFor="rating">Minimum Rating</Label>
                <Select 
                  value={minRating?.toString() || "any"} 
                  onValueChange={(value: string) => setMinRating(value === "any" ? undefined : Number(value))}
                >
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Compare Card (if products selected) */}
          {compareProducts.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Compare Products</CardTitle>
                <CardDescription>
                  {compareProducts.length} of 3 products selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {compareProducts.map(product => (
                    <div key={product.id} className="flex justify-between items-center">
                      <span className="truncate text-sm">{product.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFromCompare(product.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              {compareProducts.length > 1 && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={clearComparison}>
                    Clear All
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Compare Now</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl">
                      <DialogHeader>
                        <DialogTitle>Product Comparison</DialogTitle>
                        <DialogDescription>
                          Compare specifications and pricing across products
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[180px]">Feature</TableHead>
                              {compareProducts.map(product => (
                                <TableHead key={product.id}>{product.name}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {/* Basic Info */}
                            <TableRow>
                              <TableCell className="font-medium">Brand</TableCell>
                              {compareProducts.map(product => (
                                <TableCell key={product.id}>
                                  {productBrands.find(b => b.value === product.brand)?.name}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Rating</TableCell>
                              {compareProducts.map(product => (
                                <TableCell key={product.id}>
                                  {product.rating} ★ ({product.reviewCount} reviews)
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Price</TableCell>
                              {compareProducts.map(product => {
                                const bestPrice = getBestVendorPrice(product.vendors);
                                return (
                                  <TableCell key={product.id}>
                                    {bestPrice 
                                      ? `$${bestPrice.price.toFixed(2)} at ${bestPrice.name}`
                                      : "Out of Stock"}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Compatibility</TableCell>
                              {compareProducts.map(product => (
                                <TableCell key={product.id}>
                                  {product.compatibility.join(", ")}
                                </TableCell>
                              ))}
                            </TableRow>
                            
                            {/* Specs comparison - dynamically get all unique spec keys */}
                            {Array.from(new Set(
                              compareProducts.flatMap(product => Object.keys(product.specs))
                            )).sort().map(specKey => (
                              <TableRow key={specKey}>
                                <TableCell className="font-medium">{specKey}</TableCell>
                                {compareProducts.map(product => (
                                  <TableCell key={product.id}>
                                    {product.specs[specKey] || "N/A"}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={clearComparison}>Clear Comparison</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
        
        {/* Right Content Area - Products Table */}
        <div className="lg:col-span-3">
          {/* Sort and Count */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="font-medium">{filteredProducts.length} products</span>
              {(selectedCategory !== "all" || searchTerm || selectedBrands.length > 0 || inStockOnly) && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="ml-2 text-blue-600" 
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm whitespace-nowrap">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products Table */}
          {filteredProducts.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Product</TableHead>
                      <TableHead className="w-[15%]">Price</TableHead>
                      <TableHead className="w-[15%]">Rating</TableHead>
                      <TableHead className="w-[15%]">Availability</TableHead>
                      <TableHead className="w-[15%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(product => {
                      const bestPrice = getBestVendorPrice(product.vendors);
                      const isExpanded = expandedProductIds.includes(product.id);
                      
                      return (
                        <React.Fragment key={product.id}>
                          {/* Main Product Row */}
                          <TableRow 
                            className={isExpanded ? "bg-muted/20" : ""}
                          >
                            <TableCell>
                              <div 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => toggleExpandRow(product.id)}
                              >
                                <span className="text-gray-500 text-sm">
                                  {isExpanded ? "▼" : "▶"}
                                </span>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {productBrands.find(b => b.value === product.brand)?.name}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {bestPrice 
                                ? <span className="font-medium">${bestPrice.price.toFixed(2)}</span>
                                : <span className="text-muted-foreground">Unavailable</span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="text-amber-500 mr-1">
                                  {Array(Math.floor(product.rating)).fill("★").join("")}
                                  {product.rating % 1 > 0 ? "½" : ""}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({product.reviewCount})
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {product.inStock ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  In Stock
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  Out of Stock
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                  }}
                                >
                                  <Dialog>
                                    <DialogTrigger>Details</DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                      {selectedProduct && (
                                        <>
                                          <DialogHeader>
                                            <DialogTitle>{selectedProduct.name}</DialogTitle>
                                            <DialogDescription>
                                              {productBrands.find(b => b.value === selectedProduct.brand)?.name}
                                            </DialogDescription>
                                          </DialogHeader>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                            <div>
                                              <div className="aspect-video bg-gray-100 mb-4 flex items-center justify-center rounded-md">
                                                <div className="text-gray-500">[Product Image]</div>
                                              </div>
                                              
                                              <div className="flex items-center mb-2">
                                                <div className="text-amber-500 mr-2">
                                                  {Array(Math.floor(selectedProduct.rating)).fill("★").join("")}
                                                  {selectedProduct.rating % 1 > 0 ? "½" : ""}
                                                  <span className="text-gray-500 ml-1">
                                                    ({selectedProduct.reviewCount} reviews)
                                                  </span>
                                                </div>
                                              </div>
                                              
                                              <p className="text-gray-700 mb-4">
                                                {selectedProduct.description}
                                              </p>
                                              
                                              <div className="mb-4">
                                                <h4 className="font-medium mb-2">Compatibility</h4>
                                                <div className="flex flex-wrap gap-2">
                                                  {selectedProduct.compatibility.map(item => (
                                                    <Badge key={item} variant="secondary">
                                                      {item}
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                            
                                            <div>
                                              <h4 className="font-medium mb-2">Specifications</h4>
                                              <Table>
                                                <TableBody>
                                                  {Object.entries(selectedProduct.specs).map(([key, value]) => (
                                                    <TableRow key={key}>
                                                      <TableCell className="font-medium">{key}</TableCell>
                                                      <TableCell>{value}</TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                              
                                              <h4 className="font-medium mt-6 mb-2">Available From</h4>
                                              {selectedProduct.vendors.length > 0 ? (
                                                <Table>
                                                  <TableHeader>
                                                    <TableRow>
                                                      <TableHead>Vendor</TableHead>
                                                      <TableHead>Price</TableHead>
                                                      <TableHead>Shipping</TableHead>
                                                      <TableHead>Status</TableHead>
                                                    </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                    {selectedProduct.vendors
                                                      .sort((a, b) => a.price - b.price)
                                                      .map(vendor => (
                                                        <TableRow key={vendor.id}>
                                                          <TableCell>{vendor.name}</TableCell>
                                                          <TableCell>${vendor.price.toFixed(2)}</TableCell>
                                                          <TableCell>
                                                            {vendor.shippingCost > 0 
                                                              ? `$${vendor.shippingCost.toFixed(2)}` 
                                                              : "Free"}
                                                          </TableCell>
                                                          <TableCell>
                                                            {vendor.inStock ? (
                                                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                                                In Stock
                                                              </Badge>
                                                            ) : (
                                                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                                                Out of Stock
                                                              </Badge>
                                                            )}
                                                          </TableCell>
                                                        </TableRow>
                                                      ))}
                                                  </TableBody>
                                                </Table>
                                              ) : (
                                                <p>No vendor information available</p>
                                              )}
                                            </div>
                                          </div>
                                          
                                          <DialogFooter>
                                            <Button variant="outline">
                                              Close
                                            </Button>
                                            <Button
                                              onClick={() => {
                                                if (selectedProduct) {
                                                  addToCompare(selectedProduct);
                                                }
                                              }}
                                              disabled={
                                                !selectedProduct || 
                                                compareProducts.length >= 3 || 
                                                compareProducts.some(p => p.id === selectedProduct.id)
                                              }
                                            >
                                              Add to Comparison
                                            </Button>
                                          </DialogFooter>
                                        </>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => addToCompare(product)}
                                  disabled={
                                    compareProducts.length >= 3 || 
                                    compareProducts.some(p => p.id === product.id)
                                  }
                                >
                                  Compare
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {/* Expanded Details Row */}
                          {isExpanded && (
                            <TableRow className="bg-muted/20">
                              <TableCell colSpan={5} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                                    
                                    <h3 className="font-medium mb-2">Compatibility</h3>
                                    <div className="flex flex-wrap gap-1 mb-4">
                                      {product.compatibility.map(item => (
                                        <Badge key={item} variant="secondary" className="text-xs">
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-medium mb-2">Specifications</h3>
                                    <Table>
                                      <TableBody className="text-sm">
                                        {Object.entries(product.specs).map(([key, value]) => (
                                          <TableRow key={key}>
                                            <TableCell className="py-1 font-medium">{key}</TableCell>
                                            <TableCell className="py-1">{value}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                    
                                    <h3 className="font-medium mt-4 mb-2">Vendors</h3>
                                    <div className="text-sm space-y-1">
                                      {product.vendors
                                        .sort((a, b) => a.price - b.price)
                                        .map(vendor => (
                                          <div key={vendor.id} className="flex justify-between items-center">
                                            <span>
                                              {vendor.name} - ${vendor.price.toFixed(2)}
                                              {vendor.shippingCost > 0 
                                                ? ` + $${vendor.shippingCost.toFixed(2)} shipping` 
                                                : " (Free shipping)"}
                                            </span>
                                            <Badge 
                                              variant="outline" 
                                              className={vendor.inStock 
                                                ? "bg-green-50 text-green-700 text-xs"
                                                : "bg-red-50 text-red-700 text-xs"}
                                            >
                                              {vendor.inStock ? "In Stock" : "Out of Stock"}
                                            </Badge>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={resetFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 