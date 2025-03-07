import { Part } from './api';

// Define the shape of what we'll store
export interface BuilderState {
  firearmId: string;
  firearmModel?: {
    id: number;
    name: string;
  };
  components: ComponentState[];
  expandedItems: number[];
}

export interface ComponentState {
  id: number;
  category: string;
  subcategory: string;
  isRequired: boolean;
  isPrebuilt: boolean;
  selectedPart: Part | null;
  parentId?: number;
  subComponents?: ComponentState[];
}

const STORAGE_KEY = 'gunguruBuilderState';

// Save the current builder state to localStorage
export function saveBuilderState(state: BuilderState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save builder state to localStorage:', error);
  }
}

// Load the builder state from localStorage
export function loadBuilderState(): BuilderState | null {
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (!storedState) return null;
    
    return JSON.parse(storedState) as BuilderState;
  } catch (error) {
    console.error('Failed to load builder state from localStorage:', error);
    return null;
  }
}

// Clear the stored builder state
export function clearBuilderState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear builder state from localStorage:', error);
  }
}

// Get the stored firearm ID, if any
export function getStoredFirearmId(): string | null {
  const state = loadBuilderState();
  return state?.firearmId || null;
}

// Check if there's a stored state for a specific firearm
export function hasStoredStateForFirearm(firearmId: string): boolean {
  const state = loadBuilderState();
  return state?.firearmId === firearmId;
}

// Update a component's selected part in the stored state
export function updateStoredComponent(
  firearmId: string, 
  componentId: number, 
  part: Part | null, 
  isAssembly: boolean
): void {
  const state = loadBuilderState();
  if (!state || state.firearmId !== firearmId) return;
  
  // Helper function to recursively find and update the component
  const updateComponent = (components: ComponentState[]): boolean => {
    for (let i = 0; i < components.length; i++) {
      if (components[i].id === componentId) {
        components[i].selectedPart = part;
        components[i].isPrebuilt = isAssembly;
        return true;
      }
      
      const subComponents = components[i].subComponents;
      if (subComponents && subComponents.length > 0) {
        if (updateComponent(subComponents)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  updateComponent(state.components);
  saveBuilderState(state);
} 