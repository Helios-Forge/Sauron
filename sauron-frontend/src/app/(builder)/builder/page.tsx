"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronRight, ChevronDown } from "lucide-react"
import { categoryConfig } from "../products/category-config"
import { Category } from "../products/categories"
import { usStates } from "./mock-data"
import { cn } from "@/lib/utils"
import { useBuilderContext } from "@/contexts/BuilderContext"
import { getMockPartById } from "@/lib/builder/mockData"
import type { Part } from "@/types/builder"

export default function BuilderPage() {
  const {
    selectedParts,
    getPartByCategory,
    addPart,
    removePart,
    isPartReplaceable,
    getOriginalPart,
    validateBuild,
    clearBuild,
  } = useBuilderContext();

  const [selectedState, setSelectedState] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();

  // Handle URL parameters for part selection
  useEffect(() => {
    const categoryId = searchParams.get('category');
    const partId = searchParams.get('part');
    
    if (categoryId && partId) {
      const part = getMockPartById(partId);
      if (part) {
        addPart(categoryId, part);
        
        // Expand parent categories
        const expandParents = (category: Category) => {
          if (category.parentId) {
            setExpandedCategories(prev => new Set([...prev, category.parentId!]));
            const parent = categoryConfig.find(c => c.id === category.parentId) ||
                          categoryConfig.flatMap(c => c.children || []).find(c => c.id === category.parentId);
            if (parent) {
              expandParents(parent);
            }
          }
        };
        
        const category = categoryConfig.flatMap(c => c.children || []).find(c => c.id === categoryId);
        if (category) {
          expandParents(category);
        }
      }
    }
  }, [searchParams, addPart]);

  // Reset all selections
  const handleReset = () => {
    clearBuild();
    setSelectedState("");
    setExpandedCategories(new Set());
  };

  // Render category row recursively
  const renderCategoryRow = (category: Category, depth: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const selectedPart = getPartByCategory(category.id);
    const isReplaceable = isPartReplaceable(category.id);
    const originalPart = getOriginalPart(category.id);
    
    return (
      <React.Fragment key={category.id}>
        <TableRow>
          <TableCell className="py-2">
            <div
              className={cn(
                "flex items-center gap-2",
                hasChildren && "cursor-pointer",
                depth > 0 && "ml-4"
              )}
              onClick={() => {
                if (hasChildren) {
                  setExpandedCategories(prev => {
                    const next = new Set(prev);
                    if (next.has(category.id)) {
                      next.delete(category.id);
                    } else {
                      next.add(category.id);
                    }
                    return next;
                  });
                }
              }}
            >
              {hasChildren && (
                isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              )}
              <span>{category.name}</span>
            </div>
          </TableCell>
          <TableCell>
            {selectedPart ? (
              <div className="flex items-center gap-2">
                <span>{selectedPart.name}</span>
                {originalPart && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                    Replaced from {originalPart.name}
                  </Badge>
                )}
                {isReplaceable && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                    Replaceable
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">No part selected</span>
            )}
          </TableCell>
          <TableCell>
            {(!hasChildren || category.id === 'bcg') && (
              <Link 
                href={`/products?category=${category.id}${
                  selectedPart?.type === 'SUBCOMPONENT' 
                    ? `&returnToBuilder=true` 
                    : ''
                }`}
                className="w-full"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    originalPart && "border-yellow-500 hover:border-yellow-600"
                  )}
                >
                  {selectedPart ? (
                    originalPart ? 'Change Custom Part' : 'Change Part'
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus size={16} />
                      <span>Add Part</span>
                    </div>
                  )}
                </Button>
              </Link>
            )}
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && (
          category.children?.map((child: Category) => renderCategoryRow(child, depth + 1))
        )}
      </React.Fragment>
    );
  };

  // Get validation results
  const validationResult = validateBuild();

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">GunGuru Builder</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {usStates.map(state => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
      </div>

      {validationResult.errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="font-semibold text-red-700 mb-2">Validation Errors:</h3>
          <ul className="list-disc list-inside">
            {validationResult.errors.map((error, index) => (
              <li key={index} className="text-red-600">
                {error.message} ({error.categoryId})
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Category</TableHead>
            <TableHead>Selected Part</TableHead>
            <TableHead className="w-[150px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryConfig.map((category) => renderCategoryRow(category))}
        </TableBody>
      </Table>
    </div>
  );
} 