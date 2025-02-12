import { useReducer, useCallback, useMemo } from 'react';
import { builderReducer } from './reducer';
import { loggingMiddleware, composeMiddleware } from './middleware';
import {
  BuilderState,
  Part,
  AssemblyPart,
  SubcomponentPart,
  CategoryId,
  PartId,
  ValidationResult,
  ValidationError,
  CompatibilityRule,
} from '@/types/builder';

const initialState: BuilderState = {
  selectedParts: {},
  partDetails: {},
  assemblies: {},
};

// Create enhanced reducer with middleware
const enhancedReducer = composeMiddleware(loggingMiddleware)(builderReducer);

export function useBuilder(compatibilityRules: CompatibilityRule[] = []) {
  const [state, dispatch] = useReducer(enhancedReducer, initialState);

  // Memoized selectors
  const selectedParts = useMemo(() => state.selectedParts, [state.selectedParts]);
  const partDetails = useMemo(() => state.partDetails, [state.partDetails]);
  const assemblies = useMemo(() => state.assemblies, [state.assemblies]);

  // Get part details by category
  const getPartByCategory = useCallback(
    (categoryId: CategoryId) => {
      const partId = selectedParts[categoryId];
      return partId ? partDetails[partId] : undefined;
    },
    [selectedParts, partDetails]
  );

  // Add a part to the build
  const addPart = useCallback(
    (categoryId: CategoryId, part: Part) => {
      dispatch({ type: 'ADD_PART', payload: { categoryId, part } });
    },
    []
  );

  // Remove a part from the build
  const removePart = useCallback(
    (categoryId: CategoryId) => {
      dispatch({ type: 'REMOVE_PART', payload: { categoryId } });
    },
    []
  );

  // Replace a subcomponent
  const replaceSubcomponent = useCallback(
    (categoryId: CategoryId, newPart: SubcomponentPart) => {
      dispatch({
        type: 'REPLACE_SUBCOMPONENT',
        payload: { categoryId, newPart },
      });
    },
    []
  );

  // Add a complete assembly
  const addAssembly = useCallback(
    (assembly: AssemblyPart) => {
      const config = {
        mainPartId: assembly.id,
        includedParts: assembly.subcomponents,
      };
      dispatch({ type: 'ADD_ASSEMBLY', payload: { assembly, config } });
    },
    []
  );

  // Clear the entire build
  const clearBuild = useCallback(() => {
    dispatch({ type: 'CLEAR_BUILD' });
  }, []);

  // Check if a part is replaceable
  const isPartReplaceable = useCallback(
    (categoryId: CategoryId) => {
      const part = getPartByCategory(categoryId);
      return part?.type === 'SUBCOMPONENT' && part.isReplaceable;
    },
    [getPartByCategory]
  );

  // Get the original part if replaced
  const getOriginalPart = useCallback(
    (categoryId: CategoryId) => {
      const part = getPartByCategory(categoryId);
      if (part?.type !== 'SUBCOMPONENT' || !part.originalPartId) return null;
      return partDetails[part.originalPartId];
    },
    [getPartByCategory, partDetails]
  );

  // Get all parts in an assembly
  const getAssemblyParts = useCallback(
    (assemblyId: PartId) => {
      const assembly = partDetails[assemblyId];
      if (assembly?.type !== 'ASSEMBLY') return [];

      return assembly.subcomponents.map((config) => ({
        categoryId: config.categoryId,
        part: partDetails[config.partId],
        isReplaceable: config.isReplaceable,
      }));
    },
    [partDetails]
  );

  // Validate the current build
  const validateBuild = useCallback((): ValidationResult => {
    const errors: ValidationError[] = [];

    // Check compatibility rules
    for (const rule of compatibilityRules) {
      const part1 = getPartByCategory(rule.categoryId);
      if (!part1) continue;

      for (const compatibility of rule.compatibleWith) {
        const part2 = getPartByCategory(compatibility.categoryId);
        if (!part2) continue;

        if (compatibility.condition && !compatibility.condition(part1, part2)) {
          errors.push({
            categoryId: rule.categoryId,
            message: `Incompatible with ${part2.name}`,
            severity: 'ERROR' as const,
          });
        }
      }
    }

    // Check assembly integrity
    Object.values(partDetails).forEach((part) => {
      if (part.type === 'SUBCOMPONENT' && part.parentAssemblyId) {
        const assembly = partDetails[part.parentAssemblyId];
        if (!assembly || assembly.type !== 'ASSEMBLY') {
          errors.push({
            categoryId: part.categoryId,
            message: 'Orphaned subcomponent',
            severity: 'ERROR' as const,
          });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [compatibilityRules, getPartByCategory, partDetails]);

  return {
    // State
    selectedParts,
    partDetails,
    assemblies,

    // Actions
    addPart,
    removePart,
    replaceSubcomponent,
    addAssembly,
    clearBuild,

    // Selectors
    getPartByCategory,
    isPartReplaceable,
    getOriginalPart,
    getAssemblyParts,

    // Validation
    validateBuild,
  };
} 