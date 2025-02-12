import React, { createContext, useContext } from 'react';
import { useBuilder } from '@/lib/builder/useBuilder';
import { mockData } from '@/lib/builder/mockData';
import type {
  Part,
  CategoryId,
  PartId,
  SubcomponentPart,
  AssemblyPart,
  ValidationResult,
} from '@/types/builder';

interface BuilderContextValue {
  // State
  selectedParts: Record<CategoryId, PartId>;
  partDetails: Record<PartId, Part>;
  assemblies: Record<PartId, { mainPartId: PartId; includedParts: { categoryId: CategoryId; partId: PartId; isReplaceable: boolean; }[] }>;

  // Actions
  addPart: (categoryId: CategoryId, part: Part) => void;
  removePart: (categoryId: CategoryId) => void;
  replaceSubcomponent: (categoryId: CategoryId, newPart: SubcomponentPart) => void;
  addAssembly: (assembly: AssemblyPart) => void;
  clearBuild: () => void;

  // Selectors
  getPartByCategory: (categoryId: CategoryId) => Part | undefined;
  isPartReplaceable: (categoryId: CategoryId) => boolean;
  getOriginalPart: (categoryId: CategoryId) => Part | null;
  getAssemblyParts: (assemblyId: PartId) => Array<{
    categoryId: CategoryId;
    part: Part;
    isReplaceable: boolean;
  }>;

  // Validation
  validateBuild: () => ValidationResult;
}

const BuilderContext = createContext<BuilderContextValue | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  // Initialize with mock data
  const builder = useBuilder(mockData.compatibilityRules);

  const value: BuilderContextValue = {
    ...builder
  };

  console.log('[DEBUG] BuilderProvider initialized with:', {
    mockDataParts: mockData.parts.length,
    mockDataAssemblies: mockData.assemblies.length,
    currentState: {
      selectedParts: builder.selectedParts,
      partDetails: builder.partDetails,
      assemblies: builder.assemblies
    }
  });

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilderContext() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilderContext must be used within a BuilderProvider');
  }
  return context;
}