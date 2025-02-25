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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  AR15Config, 
  FirearmConfig, 
  FirearmCategory, 
  FirearmPart,
  preBuiltConfigurations,
  usStates
} from "./mock-data"

export default function Builder() {
  // State for the firearm configuration
  const [selectedFirearm, setSelectedFirearm] = useState<FirearmConfig>(AR15Config);
  const [selectedParts, setSelectedParts] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [complianceIssues, setComplianceIssues] = useState<{part: string, reason: string}[]>([]);
  
  // Initialize with base AR-15
  useEffect(() => {
    // You could load different firearm configs here if available
  }, []);

  // Calculate the total price when selected parts change
  useEffect(() => {
    let total = 0;
    
    // Helper function to find a part and add its price
    const addPartPrice = (categories: FirearmCategory[], partId: string) => {
      for (const category of categories) {
        // Check parts in this category
        for (const part of category.parts) {
          if (part.id === partId) {
            total += part.price;
            return true;
          }
        }
        
        // Check subcategories
        if (category.subCategories) {
          if (addPartPrice(category.subCategories, partId)) {
            return true;
          }
        }
      }
      return false;
    };
    
    // Add up prices for all selected parts
    Object.values(selectedParts).forEach(partId => {
      addPartPrice(selectedFirearm.categories, partId);
    });
    
    setTotalPrice(total);
  }, [selectedParts, selectedFirearm]);

  // Check for compliance issues when state or parts change
  useEffect(() => {
    if (!selectedState || selectedState === "federal") {
      setComplianceIssues([]);
      return;
    }
    
    const issues: {part: string, reason: string}[] = [];
    
    // Helper function to check for restrictions
    const checkPartRestrictions = (categories: FirearmCategory[], partId: string) => {
      for (const category of categories) {
        // Check parts in this category
        for (const part of category.parts) {
          if (part.id === partId && part.restrictions) {
            for (const restriction of part.restrictions) {
              if (restriction.state === selectedState) {
                issues.push({
                  part: part.name,
                  reason: restriction.reason
                });
              }
            }
            return;
          }
        }
        
        // Check subcategories
        if (category.subCategories) {
          checkPartRestrictions(category.subCategories, partId);
        }
      }
    };
    
    // Check all selected parts
    Object.values(selectedParts).forEach(partId => {
      checkPartRestrictions(selectedFirearm.categories, partId);
    });
    
    setComplianceIssues(issues);
  }, [selectedParts, selectedState, selectedFirearm]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  // Toggle subcategory expansion
  const toggleSubCategory = (subCategoryId: string) => {
    if (expandedSubCategories.includes(subCategoryId)) {
      setExpandedSubCategories(expandedSubCategories.filter(id => id !== subCategoryId));
    } else {
      setExpandedSubCategories([...expandedSubCategories, subCategoryId]);
    }
  };

  // Handle part selection
  const selectPart = (categoryId: string, partId: string) => {
    setSelectedParts(prev => ({
      ...prev,
      [categoryId]: partId
    }));
  };

  // Handle pre-built configuration selection
  const selectPreBuiltConfig = (configId: string) => {
    const config = preBuiltConfigurations.find(c => c.id === configId);
    if (!config) return;
    
    // Create a new parts object
    const newParts: Record<string, string> = {};
    
    // Helper function to find the category for a part
    const findCategoryForPart = (categories: FirearmCategory[], partId: string): string | null => {
      for (const category of categories) {
        // Check parts in this category
        for (const part of category.parts) {
          if (part.id === partId) {
            return category.id;
          }
        }
        
        // Check subcategories
        if (category.subCategories) {
          for (const subCategory of category.subCategories) {
            for (const part of subCategory.parts) {
              if (part.id === partId) {
                return subCategory.id;
              }
            }
          }
        }
      }
      return null;
    };
    
    // Add each part to the correct category
    config.parts.forEach(partId => {
      const categoryId = findCategoryForPart(selectedFirearm.categories, partId);
      if (categoryId) {
        newParts[categoryId] = partId;
      }
    });
    
    setSelectedParts(newParts);
  };

  // Find a part by ID
  const findPartById = (categories: FirearmCategory[], partId: string): FirearmPart | null => {
    for (const category of categories) {
      // Check parts in this category
      for (const part of category.parts) {
        if (part.id === partId) {
          return part;
        }
      }
      
      // Check subcategories
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          for (const part of subCategory.parts) {
            if (part.id === partId) {
              return part;
            }
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">GunGuru Builder</h1>
      
      <Tabs defaultValue="builder" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Component Builder</TabsTrigger>
          <TabsTrigger value="prebuilt">Pre-Built Firearms</TabsTrigger>
          <TabsTrigger value="saved">Saved Builds</TabsTrigger>
        </TabsList>
        
        {/* COMPONENT BUILDER TAB */}
        <TabsContent value="builder">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Configuration Options */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Custom Build: {selectedFirearm.name}</CardTitle>
                      <CardDescription>{selectedFirearm.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Save Build
                      </Button>
                      <Button variant="outline" size="sm">
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-4">
                    <label htmlFor="state-select" className="font-medium">
                      Select State for Compliance:
                    </label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger id="state-select" className="w-[180px]">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="federal">Federal (no state restrictions)</SelectItem>
                        {usStates.map(state => (
                          <SelectItem key={state.code} value={state.name}>
                            {state.name}
                            {state.restrictive && " (Restricted)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Compliance Warnings */}
                  {complianceIssues.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <h3 className="text-red-700 font-medium mb-2">
                        Compliance Issues Detected
                      </h3>
                      <ul className="list-disc pl-5 text-sm">
                        {complianceIssues.map((issue, idx) => (
                          <li key={idx} className="text-red-700">
                            <span className="font-medium">{issue.part}:</span> {issue.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Component Selection Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Component</TableHead>
                        <TableHead>Selected Part</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFirearm.categories.map(category => (
                        <React.Fragment key={category.id}>
                          {/* Main Category Row */}
                          <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => toggleCategory(category.id)}>
                            <TableCell className="font-medium">
                              {expandedCategories.includes(category.id) ? '▼' : '▶'} {category.name}
                              {category.required && <Badge variant="outline" className="ml-2">Required</Badge>}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right"></TableCell>
                          </TableRow>
                          
                          {/* Subcategories (if expanded) */}
                          {expandedCategories.includes(category.id) && category.subCategories && category.subCategories.map(subCategory => (
                            <React.Fragment key={subCategory.id}>
                              {/* Subcategory Row */}
                              <TableRow className="hover:bg-muted/50 cursor-pointer bg-gray-50" onClick={() => toggleSubCategory(subCategory.id)}>
                                <TableCell className="font-medium pl-8">
                                  {expandedSubCategories.includes(subCategory.id) ? '▼' : '▶'} {subCategory.name}
                                  {subCategory.required && <Badge variant="outline" className="ml-2">Required</Badge>}
                                </TableCell>
                                <TableCell>
                                  {selectedParts[subCategory.id] && 
                                    findPartById(selectedFirearm.categories, selectedParts[subCategory.id])?.name}
                                </TableCell>
                                <TableCell className="text-right">
                                  {selectedParts[subCategory.id] && 
                                    `$${findPartById(selectedFirearm.categories, selectedParts[subCategory.id])?.price.toFixed(2) || 0}`}
                                </TableCell>
                              </TableRow>
                              
                              {/* Parts List (if subcategory expanded) */}
                              {expandedSubCategories.includes(subCategory.id) && subCategory.parts.map(part => (
                                <TableRow key={part.id} 
                                  className={`hover:bg-blue-50 cursor-pointer ${selectedParts[subCategory.id] === part.id ? 'bg-blue-50' : ''}`}
                                  onClick={() => selectPart(subCategory.id, part.id)}>
                                  <TableCell className="pl-12">
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 mr-2 rounded-full border border-gray-300 flex items-center justify-center">
                                        {selectedParts[subCategory.id] === part.id && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                      </div>
                                      {part.name}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{part.description}</p>
                                    {!part.inStock && <Badge variant="secondary" className="mt-1">Out of Stock</Badge>}
                                    {selectedState && part.restrictions?.some(r => r.state === selectedState) && (
                                      <Badge variant="destructive" className="mt-1 ml-2">Restricted</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="font-medium">Rating: {part.rating}/5</span>
                                      <span className="text-xs">Compatible: {part.compatibility.join(', ')}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">${part.price.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          ))}
                          
                          {/* Direct Parts (if no subcategories) */}
                          {expandedCategories.includes(category.id) && category.parts.map(part => (
                            <TableRow key={part.id} 
                              className={`hover:bg-blue-50 cursor-pointer ${selectedParts[category.id] === part.id ? 'bg-blue-50' : ''}`}
                              onClick={() => selectPart(category.id, part.id)}>
                              <TableCell className="pl-8">
                                <div className="flex items-center">
                                  <div className="w-4 h-4 mr-2 rounded-full border border-gray-300 flex items-center justify-center">
                                    {selectedParts[category.id] === part.id && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                  </div>
                                  {part.name}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{part.description}</p>
                                {!part.inStock && <Badge variant="secondary" className="mt-1">Out of Stock</Badge>}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">Rating: {part.rating}/5</span>
                                  <span className="text-xs">Compatible: {part.compatibility.join(', ')}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">${part.price.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Preview & Summary */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Build Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-full aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">[Build Visualization]</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Build Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Selected Components</h3>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(selectedParts).map(([categoryId, partId]) => {
                          const part = findPartById(selectedFirearm.categories, partId);
                          if (!part) return null;
                          return (
                            <li key={partId} className="flex justify-between">
                              <span>{part.name}</span>
                              <span>${part.price.toFixed(2)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Total Price:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Build</Button>
                  <Button>Add to Cart</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* PRE-BUILT FIREARMS TAB */}
        <TabsContent value="prebuilt">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preBuiltConfigurations.map(config => (
              <Card key={config.id}>
                <CardHeader>
                  <CardTitle>{config.name}</CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <p className="text-gray-500">[Firearm Image]</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    A pre-configured build with {config.parts.length} selected components.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      selectPreBuiltConfig(config.id);
                      const builderTab = document.querySelector('[data-value="builder"]') as HTMLElement;
                      if (builderTab) builderTab.click();
                    }}
                  >
                    Load Configuration
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* SAVED BUILDS TAB */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Builds</CardTitle>
              <CardDescription>
                Your saved firearm configurations will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any saved builds yet.</p>
              <Button variant="outline" onClick={() => {
                const builderTab = document.querySelector('[data-value="builder"]') as HTMLElement;
                if (builderTab) builderTab.click();
              }}>
                Start Building
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}