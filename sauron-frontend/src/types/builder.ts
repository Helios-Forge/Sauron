// Part Types
export type PartId = string;
export type CategoryId = string;

export interface BasePart {
  id: PartId;
  name: string;
  categoryId: CategoryId;
  price: number;
  description?: string;
}

// Discriminated union for different part types
export type PartType = 'STANDALONE' | 'ASSEMBLY' | 'SUBCOMPONENT';

export interface StandalonePart extends BasePart {
  type: 'STANDALONE';
}

export interface AssemblyPart extends BasePart {
  type: 'ASSEMBLY';
  subcomponents: SubcomponentConfig[];
}

export interface SubcomponentPart extends BasePart {
  type: 'SUBCOMPONENT';
  parentAssemblyId?: PartId;
  isReplaceable: boolean;
  originalPartId?: PartId;
  replacementDate?: Date;
}

export type Part = StandalonePart | AssemblyPart | SubcomponentPart;

// Configuration Types
export interface SubcomponentConfig {
  categoryId: CategoryId;
  partId: PartId;
  isReplaceable: boolean;
}

export interface AssemblyConfig {
  mainPartId: PartId;
  includedParts: SubcomponentConfig[];
}

// State Types
export interface BuilderState {
  selectedParts: Record<CategoryId, PartId>;
  partDetails: Record<PartId, Part>;
  assemblies: Record<PartId, AssemblyConfig>;
}

// Action Types
export type BuilderAction =
  | { type: 'ADD_PART'; payload: { categoryId: CategoryId; part: Part } }
  | { type: 'REMOVE_PART'; payload: { categoryId: CategoryId } }
  | { type: 'REPLACE_SUBCOMPONENT'; payload: { categoryId: CategoryId; newPart: SubcomponentPart } }
  | { type: 'ADD_ASSEMBLY'; payload: { assembly: AssemblyPart; config: AssemblyConfig } }
  | { type: 'CLEAR_BUILD' };

// Validation Types
export interface CompatibilityRule {
  categoryId: CategoryId;
  compatibleWith: {
    categoryId: CategoryId;
    condition?: (part1: Part, part2: Part) => boolean;
  }[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  categoryId: CategoryId;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

// Mock Data Interface
export interface MockDataConfig {
  parts: Part[];
  assemblies: AssemblyConfig[];
  compatibilityRules: CompatibilityRule[];
} 