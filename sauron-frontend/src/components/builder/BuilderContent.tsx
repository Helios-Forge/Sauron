"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BuilderWorksheet from '@/components/builder/BuilderWorksheet';
import FirearmSelector from '@/components/builder/FirearmSelector';
import BuildSummary from '@/components/builder/BuildSummary';
import { Part } from '@/lib/api';

// Define the builder state interface for type safety
interface BuilderState {
  firearmId: string | null;
  buildStep: 'select-model' | 'select-components';
  selectedComponentsCount: number;
  requiredComponentsCount: number;
  totalPrice: number;
  compatibilityStatus: 'compatible' | 'warning' | 'incompatible';
  components?: {
    category: string;
    part: Part | null;
    required: boolean;
  }[];
}

export default function BuilderContent() {
  const searchParams = useSearchParams();
  
  const [builderState, setBuilderState] = useState<BuilderState>({
    firearmId: null,
    buildStep: 'select-model',
    selectedComponentsCount: 0,
    requiredComponentsCount: 0,
    totalPrice: 0,
    compatibilityStatus: 'compatible',
    components: []
  });

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('builderState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setBuilderState(parsedState);
      } catch (error) {
        console.error('Error parsing saved builder state:', error);
        // If there's an error, just use the default state
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('builderState', JSON.stringify(builderState));
  }, [builderState]);

  // Handle firearm model selection
  const handleModelSelected = (modelId: string) => {
    setBuilderState(prev => ({
      ...prev,
      firearmId: modelId,
      buildStep: 'select-components',
      // Reset build data when a new model is selected
      selectedComponentsCount: 0,
      requiredComponentsCount: 0,
      totalPrice: 0,
      compatibilityStatus: 'compatible',
      components: []
    }));
  };

  // Handle build update from the BuilderWorksheet
  const handleBuildUpdate = (
    selectedCount: number, 
    requiredCount: number, 
    price: number, 
    compatibility: 'compatible' | 'warning' | 'incompatible',
    components?: {
      category: string;
      part: Part | null;
      required: boolean;
    }[]
  ) => {
    setBuilderState(prev => ({
      ...prev,
      selectedComponentsCount: selectedCount,
      requiredComponentsCount: requiredCount,
      totalPrice: price,
      compatibilityStatus: compatibility,
      components: components || []
    }));
  };

  // Handle clearing the build
  const handleClearBuild = () => {
    setBuilderState({
      firearmId: null,
      buildStep: 'select-model',
      selectedComponentsCount: 0,
      requiredComponentsCount: 0,
      totalPrice: 0,
      compatibilityStatus: 'compatible',
      components: []
    });
  };

  // Handle saving the build
  const handleSaveBuild = () => {
    // In a real implementation, this would send the build to a backend API
    // For now, we just console log it
    console.log('Saving build:', builderState);
    
    // We could also push it to a "saved builds" array in localStorage
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
    savedBuilds.push({
      ...builderState,
      id: `build-${Date.now()}`,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('savedBuilds', JSON.stringify(savedBuilds));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Firearm Builder</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Build your custom firearm with compatible parts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Build Area */}
        <div className="lg:col-span-3 space-y-6">
          {builderState.buildStep === 'select-model' ? (
            <FirearmSelector onModelSelected={handleModelSelected} />
          ) : (
            builderState.firearmId && (
              <BuilderWorksheet 
                firearmId={builderState.firearmId} 
                onBuildUpdate={handleBuildUpdate} 
              />
            )
          )}
        </div>
        
        {/* Build Summary */}
        <div className="lg:col-span-1">
          <BuildSummary 
            selectedCount={builderState.selectedComponentsCount}
            requiredCount={builderState.requiredComponentsCount}
            totalPrice={builderState.totalPrice}
            compatibilityStatus={builderState.compatibilityStatus}
            onClearBuild={handleClearBuild}
            onSaveBuild={handleSaveBuild}
            components={builderState.components}
            showDetailedSummary={builderState.buildStep === 'select-components' && builderState.selectedComponentsCount > 0}
          />
        </div>
      </div>
    </div>
  );
} 