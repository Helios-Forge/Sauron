"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BuilderWorksheet from '@/components/builder/BuilderWorksheet';
import FirearmSelector from '@/components/builder/FirearmSelector';
import BuildSummary from '@/components/builder/BuildSummary';

// Define the builder state interface for type safety
interface BuilderState {
  firearmId: string | null;
  buildStep: 'select-model' | 'customize';
  selectedComponentsCount: number;
  requiredComponentsCount: number;
  totalPrice: number;
  compatibilityStatus: 'compatible' | 'warning' | 'incompatible';
  components?: any[]; // We'll store the actual component data structure
}

export default function BuilderContent() {
  const searchParams = useSearchParams();
  
  const [selectedFirearmId, setSelectedFirearmId] = useState<string | null>(null);
  const [buildStep, setBuildStep] = useState<'select-model' | 'customize'>('select-model');
  const [selectedComponentsCount, setSelectedComponentsCount] = useState(0);
  const [requiredComponentsCount, setRequiredComponentsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [compatibilityStatus, setCompatibilityStatus] = useState<'compatible' | 'warning' | 'incompatible'>('compatible');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAssembly, setIsAssembly] = useState<boolean>(false);
  const [components, setComponents] = useState<any[]>([]);

  // Load saved state from localStorage on initial mount
  useEffect(() => {
    // Only run in the browser
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('builderState');
      
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState) as BuilderState;
          
          // Restore the state
          setSelectedFirearmId(parsedState.firearmId);
          setBuildStep(parsedState.buildStep);
          setSelectedComponentsCount(parsedState.selectedComponentsCount);
          setRequiredComponentsCount(parsedState.requiredComponentsCount);
          setTotalPrice(parsedState.totalPrice);
          setCompatibilityStatus(parsedState.compatibilityStatus);
          
          // If we have components data, restore it
          if (parsedState.components) {
            setComponents(parsedState.components);
          }
        } catch (error) {
          console.error('Error parsing saved builder state:', error);
          // If there's an error, we'll just use the default state
        }
      }
    }
  }, []);

  // Check for URL parameters after loading from localStorage
  // URL parameters take precedence over localStorage
  useEffect(() => {
    const firearmId = searchParams.get('firearmId');
    const componentId = searchParams.get('componentId');
    const productId = searchParams.get('productId');
    const assembly = searchParams.get('isAssembly') === 'true';
    
    // If we have a firearmId in the URL, use it to restore state
    if (firearmId) {
      setSelectedFirearmId(firearmId);
      setBuildStep('customize');
      
      // If we also have component and product IDs, they were selected in the catalog
      if (componentId && productId) {
        setSelectedComponentId(componentId);
        setSelectedProductId(productId);
        setIsAssembly(assembly);
      }
    }
  }, [searchParams]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    // Only save if we have a selected firearm
    if (selectedFirearmId) {
      const stateToSave: BuilderState = {
        firearmId: selectedFirearmId,
        buildStep,
        selectedComponentsCount,
        requiredComponentsCount,
        totalPrice,
        compatibilityStatus,
        components
      };
      
      localStorage.setItem('builderState', JSON.stringify(stateToSave));
    }
  }, [
    selectedFirearmId,
    buildStep,
    selectedComponentsCount,
    requiredComponentsCount,
    totalPrice,
    compatibilityStatus,
    components
  ]);

  // Handle firearm model selection
  const handleModelSelected = (modelId: string) => {
    setSelectedFirearmId(modelId);
    setBuildStep('customize');
  };

  // Handle build updates
  const handleBuildUpdate = (
    selectedCount: number, 
    requiredCount: number, 
    price: number, 
    compatibility: 'compatible' | 'warning' | 'incompatible',
    updatedComponents?: any[]
  ) => {
    setSelectedComponentsCount(selectedCount);
    setRequiredComponentsCount(requiredCount);
    setTotalPrice(price);
    setCompatibilityStatus(compatibility);
    
    // If we have updated components, save them
    if (updatedComponents) {
      setComponents(updatedComponents);
    }
  };

  // Clear the current build
  const handleClearBuild = () => {
    // Clear localStorage
    localStorage.removeItem('builderState');
    
    // Reset state
    setSelectedFirearmId(null);
    setBuildStep('select-model');
    setSelectedComponentsCount(0);
    setRequiredComponentsCount(0);
    setTotalPrice(0);
    setCompatibilityStatus('compatible');
    setSelectedComponentId(null);
    setSelectedProductId(null);
    setIsAssembly(false);
    setComponents([]);
  };

  // Explicitly save the current build
  const handleSaveBuild = () => {
    if (selectedFirearmId) {
      const stateToSave: BuilderState = {
        firearmId: selectedFirearmId,
        buildStep,
        selectedComponentsCount,
        requiredComponentsCount,
        totalPrice,
        compatibilityStatus,
        components
      };
      
      localStorage.setItem('builderState', JSON.stringify(stateToSave));
      console.log('Build saved to localStorage');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Firearm Builder
        </h1>
        
        {buildStep === 'customize' && (
          <button
            onClick={handleClearBuild}
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none dark:focus:ring-red-800"
          >
            Clear Build
          </button>
        )}
      </div>
      
      {buildStep === 'select-model' ? (
        // Step 1: Select a firearm model
        <div className="mb-8">
          <FirearmSelector onModelSelected={handleModelSelected} />
        </div>
      ) : (
        // Step 2: Customize the selected firearm
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <BuilderWorksheet 
              firearmId={selectedFirearmId || ''} 
              onBuildUpdate={handleBuildUpdate}
              selectedComponentId={selectedComponentId}
              selectedProductId={selectedProductId}
              isAssembly={isAssembly}
              savedComponents={components}
            />
          </div>
          <div className="lg:col-span-1">
            <BuildSummary 
              firearmId={selectedFirearmId || ''}
              selectedComponents={selectedComponentsCount}
              requiredComponents={requiredComponentsCount}
              totalPrice={totalPrice}
              compatibilityStatus={compatibilityStatus}
              onSaveBuild={handleSaveBuild}
            />
          </div>
        </div>
      )}
    </div>
  );
} 