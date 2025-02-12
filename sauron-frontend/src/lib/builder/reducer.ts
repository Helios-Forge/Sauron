import { BuilderState, BuilderAction, Part, AssemblyPart, SubcomponentPart, CategoryId, PartId } from '@/types/builder';
import { bcgSubcomponents, bcgAssembly } from '@/lib/builder/mockData';

const initialState: BuilderState = {
  selectedParts: {},
  partDetails: {},
  assemblies: {},
};

export function builderReducer(state: BuilderState = initialState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'ADD_PART': {
      const { categoryId, part } = action.payload;
      
      // Handle different part types
      if (part.type === 'ASSEMBLY') {
        return handleAssemblyAddition(state, categoryId, part);
      } else if (part.type === 'SUBCOMPONENT') {
        return handleSubcomponentAddition(state, categoryId, part);
      }
      
      // Handle standalone part
      return {
        ...state,
        selectedParts: {
          ...state.selectedParts,
          [categoryId]: part.id,
        },
        partDetails: {
          ...state.partDetails,
          [part.id]: part,
        },
      };
    }

    case 'REMOVE_PART': {
      const { categoryId } = action.payload;
      const partId = state.selectedParts[categoryId];
      
      if (!partId) return state;
      
      const part = state.partDetails[partId];
      if (!part) return state;

      // If removing an assembly, also remove its subcomponents
      if (part.type === 'ASSEMBLY') {
        const newState = {
          selectedParts: { ...state.selectedParts },
          partDetails: { ...state.partDetails },
          assemblies: { ...state.assemblies }
        };

        // Remove the assembly
        delete newState.selectedParts[categoryId];
        delete newState.partDetails[partId];
        delete newState.assemblies[partId];

        // Remove all subcomponents
        const assemblyConfig = state.assemblies[partId];
        if (assemblyConfig) {
          assemblyConfig.includedParts.forEach(subConfig => {
            delete newState.selectedParts[subConfig.categoryId];
            delete newState.partDetails[subConfig.partId];
          });
        }

        return newState;
      }

      // If removing a subcomponent, handle parent assembly relationship
      if (part.type === 'SUBCOMPONENT' && part.parentAssemblyId) {
        return state; // Don't allow direct removal of subcomponents
      }

      // Handle standalone part removal
      const { [categoryId]: _, ...remainingParts } = state.selectedParts;
      const { [partId]: __, ...remainingDetails } = state.partDetails;

      return {
        ...state,
        selectedParts: remainingParts,
        partDetails: remainingDetails
      };
    }

    case 'REPLACE_SUBCOMPONENT': {
      const { categoryId, newPart } = action.payload;
      
      if (newPart.type !== 'SUBCOMPONENT') {
        console.error('Attempted to replace with non-subcomponent part');
        return state;
      }

      const oldPartId = state.selectedParts[categoryId];
      if (!oldPartId) return state;

      const oldPart = state.partDetails[oldPartId];
      if (!oldPart || oldPart.type !== 'SUBCOMPONENT') return state;

      // Ensure the subcomponent is replaceable
      if (!oldPart.isReplaceable) {
        console.error('Attempted to replace non-replaceable subcomponent');
        return state;
      }

      // Update the new part with replacement information
      const updatedNewPart: SubcomponentPart = {
        ...newPart,
        originalPartId: oldPart.originalPartId || oldPartId,
        replacementDate: new Date(),
        parentAssemblyId: oldPart.parentAssemblyId,
      };

      return {
        ...state,
        selectedParts: {
          ...state.selectedParts,
          [categoryId]: newPart.id,
        },
        partDetails: {
          ...state.partDetails,
          [newPart.id]: updatedNewPart,
        },
      };
    }

    case 'ADD_ASSEMBLY': {
      const { assembly } = action.payload;
      
      console.log('[DEBUG] ADD_ASSEMBLY action received:', {
        assemblyId: assembly.id,
        categoryId: assembly.categoryId,
        subcomponents: assembly.subcomponents
      });
      
      // Start with a fresh state copy
      const newState = {
        selectedParts: { ...state.selectedParts },
        partDetails: { ...state.partDetails },
        assemblies: { ...state.assemblies }
      };

      // 1. Add the assembly itself
      newState.selectedParts[assembly.categoryId] = assembly.id;
      newState.partDetails[assembly.id] = assembly;

      console.log('[DEBUG] Added assembly to state:', {
        selectedParts: newState.selectedParts,
        assemblyDetails: newState.partDetails[assembly.id]
      });

      // 2. Process each subcomponent
      assembly.subcomponents.forEach((subConfig) => {
        // Find the subcomponent in our mock data
        const mockSubcomponent = bcgSubcomponents.find(s => s.categoryId === subConfig.categoryId);
        
        if (mockSubcomponent) {
          // Create a new subcomponent instance with proper links
          const subcomponent: SubcomponentPart = {
            ...mockSubcomponent,
            id: `${assembly.id}-${subConfig.categoryId}`, // Create unique ID for the instance
            parentAssemblyId: assembly.id,
            isReplaceable: subConfig.isReplaceable
          };

          // Add to state
          newState.selectedParts[subConfig.categoryId] = subcomponent.id;
          newState.partDetails[subcomponent.id] = subcomponent;

          console.log('[DEBUG] Added subcomponent:', {
            categoryId: subConfig.categoryId,
            subcomponentId: subcomponent.id,
            parentAssemblyId: subcomponent.parentAssemblyId,
            subcomponent
          });
        } else {
          console.error('[DEBUG] Failed to find subcomponent in mock data for category:', subConfig.categoryId);
        }
      });

      // 3. Store the assembly configuration
      newState.assemblies[assembly.id] = {
        mainPartId: assembly.id,
        includedParts: assembly.subcomponents.map(subConfig => ({
          ...subConfig,
          partId: `${assembly.id}-${subConfig.categoryId}` // Match the IDs we created above
        }))
      };

      console.log('[DEBUG] Final assembly state:', {
        assembly: assembly.id,
        subcomponents: Object.keys(newState.selectedParts).filter(key => 
          newState.partDetails[newState.selectedParts[key]]?.type === 'SUBCOMPONENT'
        ),
        fullState: newState
      });

      return newState;
    }

    case 'CLEAR_BUILD':
      return initialState;

    default:
      return state;
  }
}

// Helper functions for complex state updates
function handleAssemblyAddition(
  state: BuilderState,
  categoryId: CategoryId,
  assembly: AssemblyPart
): BuilderState {
  const newState = { ...state };
  
  // Add the assembly itself
  newState.selectedParts = {
    ...newState.selectedParts,
    [categoryId]: assembly.id,
  };
  
  newState.partDetails = {
    ...newState.partDetails,
    [assembly.id]: assembly,
  };

  // Add all subcomponents
  assembly.subcomponents.forEach((config) => {
    const subcomponentPart = state.partDetails[config.partId];
    if (subcomponentPart && subcomponentPart.type === 'SUBCOMPONENT') {
      newState.selectedParts[config.categoryId] = config.partId;
      newState.partDetails[config.partId] = {
        ...subcomponentPart,
        parentAssemblyId: assembly.id,
        isReplaceable: config.isReplaceable,
      };
    }
  });

  return newState;
}

function handleAssemblyRemoval(
  state: BuilderState,
  categoryId: CategoryId,
  assembly: AssemblyPart
): BuilderState {
  const newSelectedParts = { ...state.selectedParts };
  const newPartDetails = { ...state.partDetails };
  
  // Remove the assembly
  delete newSelectedParts[categoryId];
  delete newPartDetails[assembly.id];
  
  // Remove all subcomponents
  assembly.subcomponents.forEach((config) => {
    delete newSelectedParts[config.categoryId];
    delete newPartDetails[config.partId];
  });

  return {
    ...state,
    selectedParts: newSelectedParts,
    partDetails: newPartDetails,
  };
}

function handleSubcomponentAddition(
  state: BuilderState,
  categoryId: CategoryId,
  subcomponent: SubcomponentPart
): BuilderState {
  // If this is a replacement, handle it differently
  const existingPartId = state.selectedParts[categoryId];
  if (existingPartId) {
    const existingPart = state.partDetails[existingPartId];
    if (existingPart?.type === 'SUBCOMPONENT' && existingPart.isReplaceable) {
      return builderReducer(state, {
        type: 'REPLACE_SUBCOMPONENT',
        payload: { categoryId, newPart: subcomponent },
      });
    }
  }

  // Otherwise, add as new subcomponent
  return {
    ...state,
    selectedParts: {
      ...state.selectedParts,
      [categoryId]: subcomponent.id,
    },
    partDetails: {
      ...state.partDetails,
      [subcomponent.id]: subcomponent,
    },
  };
}

function handleSubcomponentRemoval(
  state: BuilderState,
  categoryId: CategoryId,
  subcomponent: SubcomponentPart
): BuilderState {
  const { [categoryId]: _, ...remainingParts } = state.selectedParts;
  const { [subcomponent.id]: __, ...remainingDetails } = state.partDetails;

  // If this was the last subcomponent of an assembly, remove the assembly too
  if (subcomponent.parentAssemblyId) {
    const assembly = state.partDetails[subcomponent.parentAssemblyId];
    if (assembly?.type === 'ASSEMBLY') {
      const remainingSubcomponents = Object.values(remainingDetails).filter(
        (part): part is SubcomponentPart =>
          part.type === 'SUBCOMPONENT' && part.parentAssemblyId === assembly.id
      );

      if (remainingSubcomponents.length === 0) {
        delete remainingParts[assembly.categoryId];
        delete remainingDetails[assembly.id];
      }
    }
  }

  return {
    ...state,
    selectedParts: remainingParts,
    partDetails: remainingDetails,
  };
} 