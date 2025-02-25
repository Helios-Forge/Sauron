"use client"

import React, { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { stateLaws, federalLaws, gunLawGlossary, StateGunLaws, StateLaw } from "./mock-data"
import { usStates } from "../builder/mock-data"

export default function LawsPage() {
  const [selectedState, setSelectedState] = useState<string>("Federal");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedLaw, setExpandedLaw] = useState<string | null>(null);
  const [selectedLawType, setSelectedLawType] = useState<string>("overview"); // overview, laws, glossary

  // Get the selected state's laws
  const getSelectedStateLaws = (): StateGunLaws | null => {
    if (selectedState === "Federal") return null;
    return stateLaws.find(state => state.state === selectedState) || null;
  };

  // Filter laws or glossary terms based on search
  const filterItems = (items: any[], term: string): any[] => {
    if (!term) return items;
    const lowerTerm = term.toLowerCase();
    
    // If we're filtering laws
    if ('title' in (items[0] || {})) {
      return items.filter(item => 
        item.title.toLowerCase().includes(lowerTerm) || 
        item.description.toLowerCase().includes(lowerTerm)
      );
    }
    
    // If we're filtering glossary
    return items.filter(item => 
      item.term.toLowerCase().includes(lowerTerm) || 
      item.description.toLowerCase().includes(lowerTerm)
    );
  };

  // Get the laws to display based on selection
  const getDisplayLaws = (): StateLaw[] => {
    const stateData = getSelectedStateLaws();
    if (selectedState === "Federal") {
      return filterItems(federalLaws.laws, searchTerm);
    }
    return stateData ? filterItems(stateData.laws, searchTerm) : [];
  };

  // Toggle expanded law
  const toggleLaw = (lawId: string) => {
    if (expandedLaw === lawId) {
      setExpandedLaw(null);
    } else {
      setExpandedLaw(lawId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Firearm Laws & Compliance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select Jurisdiction</CardTitle>
              <CardDescription>View laws by state or federal level</CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedState} 
                onValueChange={(value) => {
                  setSelectedState(value);
                  setExpandedLaw(null);
                  setSelectedLawType("overview");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Federal">Federal Laws</SelectItem>
                  <SelectItem value="All States">All States</SelectItem>
                  {stateLaws.map(state => (
                    <SelectItem key={state.stateCode} value={state.state}>
                      {state.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">View</h3>
                <div className="space-y-2">
                  <Button 
                    variant={selectedLawType === "overview" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedLawType("overview")}
                  >
                    Overview
                  </Button>
                  <Button 
                    variant={selectedLawType === "laws" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedLawType("laws")}
                  >
                    Laws & Regulations
                  </Button>
                  <Button 
                    variant={selectedLawType === "glossary" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedLawType("glossary")}
                  >
                    Law Glossary
                  </Button>
                </div>
              </div>
              
              {/* Quick links for Builder Integration */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Check Compliance</h3>
                <Button className="w-full" asChild>
                  <Link href="/builder">Go to Builder</Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Use our Builder tool to check your firearm against these laws in real-time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Overview View */}
          {selectedLawType === "overview" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedState === "Federal" ? "Federal Firearms Laws" : `${selectedState} Firearms Laws`}
                </CardTitle>
                <CardDescription>
                  {selectedState === "Federal" 
                    ? `Last updated: ${federalLaws.lastUpdated}`
                    : getSelectedStateLaws() 
                      ? `Last updated: ${getSelectedStateLaws()?.lastUpdated}`
                      : "Select a state to view its gun laws"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedState === "Federal" && (
                  <div>
                    <p className="mb-4">{federalLaws.overviewText}</p>
                    
                    <h3 className="text-lg font-medium mt-6 mb-3">Key Federal Regulations</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>National Firearms Act (NFA) regulates short-barreled rifles, short-barreled shotguns, suppressors, and machine guns</li>
                      <li>Gun Control Act (GCA) regulates interstate commerce and establishes prohibited persons</li>
                      <li>Brady Act requires background checks for purchases from licensed dealers</li>
                      <li>NICS background check system for firearm purchases</li>
                    </ul>
                    
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <h4 className="font-medium text-amber-800 mb-2">Important Note</h4>
                      <p className="text-amber-800">
                        Federal law is the minimum standard. State and local laws may impose additional restrictions.
                        Always check state and local laws before building or purchasing a firearm.
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedState !== "Federal" && getSelectedStateLaws() && (
                  <div>
                    <p className="mb-4">{getSelectedStateLaws()?.overviewText}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Permit Requirements</h3>
                        <p className={getSelectedStateLaws()?.permitRequired ? "text-red-600" : "text-green-600"}>
                          {getSelectedStateLaws()?.permitRequired 
                            ? "Permit/License Required" 
                            : "No Permit/License Required"}
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6 mb-3">Magazine Capacity Limit</h3>
                        <p className={getSelectedStateLaws()?.magazineLimit ? "text-red-600" : "text-green-600"}>
                          {getSelectedStateLaws()?.magazineLimit 
                            ? `Limited to ${getSelectedStateLaws()?.magazineLimit} rounds` 
                            : "No magazine capacity restrictions"}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Restricted Features</h3>
                        {getSelectedStateLaws()?.restrictedFeatures.length ? (
                          <ul className="list-disc pl-5 text-red-600">
                            {getSelectedStateLaws()?.restrictedFeatures.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-green-600">No feature restrictions</p>
                        )}
                        
                        <h3 className="text-lg font-medium mt-6 mb-3">Other Restrictions</h3>
                        {getSelectedStateLaws()?.otherRestrictions.length ? (
                          <ul className="list-disc pl-5">
                            {getSelectedStateLaws()?.otherRestrictions.map((restriction, index) => (
                              <li key={index}>{restriction}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No additional restrictions</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <h4 className="font-medium text-amber-800 mb-2">Important Disclaimer</h4>
                      <p className="text-amber-800">
                        This information is provided for general educational purposes only and should not be relied 
                        upon as legal advice. Laws change frequently and may be interpreted differently by different 
                        officials. Consult with a qualified attorney in your state for specific legal advice.
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedState === "All States" && (
                  <div>
                    <p className="mb-6">
                      Select a specific state from the dropdown to view detailed information about its firearms laws.
                    </p>
                    
                    <h3 className="text-lg font-medium mb-4">States with Restrictive Firearm Laws</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {usStates
                        .filter(state => state.restrictive)
                        .map(state => (
                          <Badge key={state.code} variant="outline" className="bg-red-50 border-red-200 text-red-800">
                            {state.name}
                          </Badge>
                        ))}
                    </div>
                    
                    <h3 className="text-lg font-medium mb-4">States with Magazine Capacity Limits</h3>
                    <div className="flex flex-wrap gap-2">
                      {stateLaws
                        .filter(state => state.magazineLimit !== null)
                        .map(state => (
                          <Badge key={state.stateCode} variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                            {state.state}: {state.magazineLimit} rounds
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
              {selectedState !== "All States" && (
                <CardFooter>
                  <Button onClick={() => setSelectedLawType("laws")}>
                    View Detailed Laws
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
          
          {/* Laws & Regulations View */}
          {selectedLawType === "laws" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedState === "Federal" ? "Federal Laws" : `${selectedState} Laws`}
                    </CardTitle>
                    <CardDescription>
                      Key legislation and regulations regarding firearms
                    </CardDescription>
                  </div>
                  <Input 
                    type="search" 
                    placeholder="Search laws..." 
                    className="w-60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getDisplayLaws().length > 0 ? (
                    getDisplayLaws().map(law => (
                      <div key={law.id} className="border rounded-md">
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                          onClick={() => toggleLaw(law.id)}
                        >
                          <div>
                            <h3 className="font-medium">{law.title}</h3>
                            <p className="text-sm text-muted-foreground">{law.description}</p>
                          </div>
                          <div className="text-xl">
                            {expandedLaw === law.id ? '▼' : '▶'}
                          </div>
                        </div>
                        
                        {expandedLaw === law.id && (
                          <div className="p-4 pt-0 border-t">
                            <p className="mb-4">{law.details}</p>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Citations</h4>
                              <ul className="list-disc pl-5 text-sm">
                                {law.citations.map((citation, index) => (
                                  <li key={index}>{citation}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No laws found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Glossary View */}
          {selectedLawType === "glossary" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gun Law Glossary</CardTitle>
                    <CardDescription>
                      Definitions of key terms used in firearm legislation
                    </CardDescription>
                  </div>
                  <Input 
                    type="search" 
                    placeholder="Search terms..." 
                    className="w-60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filterItems(gunLawGlossary, searchTerm).map(term => (
                    <div key={term.id}>
                      <h3 className="text-lg font-medium">{term.term}</h3>
                      <p className="mt-1 mb-2">{term.description}</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Examples</h4>
                        <ul className="list-disc pl-5 text-sm">
                          {term.examples.map((example: string, index: number) => (
                            <li key={index} className="mb-1">{example}</li>
                          ))}
                        </ul>
                      </div>
                      <Separator className="mt-6" />
                    </div>
                  ))}
                </div>
                
                {filterItems(gunLawGlossary, searchTerm).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No terms found matching your search criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 