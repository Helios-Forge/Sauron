"use client";

import { useEffect, useState } from 'react';
import { Part } from '@/lib/api';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { X, CheckCircle, Filter, SortDesc, SortAsc } from 'lucide-react';

interface ComponentSelectorProps {
  category: string;
  partOptions: Part[];
  selectedPart: Part | null;
  isRequired: boolean;
  onPartSelected: (part: Part | null) => void;
}

export default function ComponentSelector({
  category,
  partOptions,
  selectedPart,
  isRequired,
  onPartSelected,
}: ComponentSelectorProps) {
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | 'name-asc'>('name-asc');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  
  // Extract all available subcategories from part options
  const subcategories = [...new Set(partOptions.map(part => part.subcategory))];
  
  // Filter and sort parts based on current selections
  const filteredParts = partOptions
    .filter(part => {
      // Filter by subcategory if any are selected
      if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(part.subcategory)) {
        return false;
      }
      
      // Filter by search term if present
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          part.name.toLowerCase().includes(searchLower) ||
          part.description.toLowerCase().includes(searchLower) ||
          Object.entries(part.specifications || {}).some(
            ([key, value]) => 
              key.toLowerCase().includes(searchLower) || 
              String(value).toLowerCase().includes(searchLower)
          )
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort based on selected sort order
      if (sortOrder === 'price-asc') {
        return a.price - b.price;
      } else if (sortOrder === 'price-desc') {
        return b.price - a.price;
      } else {
        // Default to name-asc
        return a.name.localeCompare(b.name);
      }
    });
  
  // Toggle subcategory selection
  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory)
        ? prev.filter(sc => sc !== subcategory)
        : [...prev, subcategory]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubcategories([]);
    setSortOrder('name-asc');
  };
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {category} 
            {isRequired && (
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                Required
              </Badge>
            )}
          </h3>
          
          {selectedPart && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onPartSelected(null)}
              className="h-8 gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
        
        {/* Search and filter bar */}
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {showFilters && (
            <div className="p-2 bg-muted/50 rounded-md space-y-2">
              <div>
                <p className="text-sm font-medium mb-1">Sort by:</p>
                <Select 
                  value={sortOrder} 
                  onValueChange={(value) => setSortOrder(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                    <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {subcategories.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Subcategories:</p>
                  <div className="flex flex-wrap gap-1">
                    {subcategories.map(subcategory => (
                      <Badge 
                        key={subcategory}
                        variant={selectedSubcategories.includes(subcategory) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleSubcategory(subcategory)}
                      >
                        {subcategory}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters} 
                className="text-xs h-7"
              >
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Selected part */}
      {selectedPart && (
        <div className="p-4 bg-muted/30 border-b">
          <div className="flex items-start gap-4">
            {selectedPart.images && selectedPart.images[0] && (
              <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                <img 
                  src={selectedPart.images[0]} 
                  alt={selectedPart.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/part-placeholder.png"; 
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium">{selectedPart.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{selectedPart.description}</p>
              <div className="mt-1 flex justify-between">
                <p className="text-sm font-semibold">
                  ${selectedPart.price.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPart.availability}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Part selection grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4">
        {filteredParts.length > 0 ? (
          filteredParts.map(part => (
            <Card 
              key={part.id} 
              className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedPart?.id === part.id ? 'border-primary' : ''}`}
              onClick={() => onPartSelected(part)}
            >
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm font-medium line-clamp-1">{part.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">{part.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pb-2">
                {part.images && part.images[0] ? (
                  <div className="h-32 w-full rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src={part.images[0]} 
                      alt={part.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/part-placeholder.png"; 
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-32 w-full rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <div className="font-medium">${part.price.toFixed(2)}</div>
                <Badge variant={
                  part.availability === "In Stock" ? "success" : 
                  part.availability === "Limited" ? "warning" : "destructive"
                }>
                  {part.availability}
                </Badge>
                {selectedPart?.id === part.id && (
                  <CheckCircle className="h-5 w-5 text-primary absolute top-2 right-2" />
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No components found matching your criteria.
            <Button 
              variant="link" 
              onClick={resetFilters} 
              className="block mx-auto mt-2"
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 