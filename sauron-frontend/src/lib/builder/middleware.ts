import { BuilderState, BuilderAction, AssemblyPart } from '@/types/builder';

// Validation functions
function validateAssembly(assembly: AssemblyPart): boolean {
  if (!assembly.id || !assembly.categoryId || !assembly.type || !assembly.subcomponents) {
    console.error('[DEBUG] Invalid assembly structure:', assembly);
    return false;
  }

  const validSubcomponents = assembly.subcomponents.every(sub => 
    sub.categoryId && sub.partId && typeof sub.isReplaceable === 'boolean'
  );

  if (!validSubcomponents) {
    console.error('[DEBUG] Invalid subcomponents in assembly:', assembly.subcomponents);
    return false;
  }

  return true;
}

// Types
type Reducer = (state: BuilderState, action: BuilderAction) => BuilderState;
type NextFunction = (state: BuilderState, action: BuilderAction) => BuilderState;

type MiddlewareFunction = (
  state: BuilderState,
  action: BuilderAction,
  next: NextFunction
) => BuilderState;

// Logging middleware
export const loggingMiddleware: MiddlewareFunction = (state, action, next) => {
  console.log('[DEBUG] Before action:', {
    type: action.type,
    payload: action.type === 'ADD_ASSEMBLY' ? action.payload : undefined,
    currentState: {
      selectedParts: state.selectedParts,
      assembliesCount: Object.keys(state.assemblies).length,
      partsCount: Object.keys(state.partDetails).length
    }
  });

  // Validate assembly actions
  if (action.type === 'ADD_ASSEMBLY') {
    if (!validateAssembly(action.payload.assembly)) {
      console.error('[DEBUG] Assembly validation failed, aborting action');
      return state;
    }
  }

  const nextState = next(state, action);

  console.log('[DEBUG] After action:', {
    type: action.type,
    newState: {
      selectedParts: nextState.selectedParts,
      assembliesCount: Object.keys(nextState.assemblies).length,
      partsCount: Object.keys(nextState.partDetails).length
    },
    changed: JSON.stringify(state) !== JSON.stringify(nextState)
  });

  return nextState;
};

// Compose multiple middleware functions
export function composeMiddleware(...middlewares: MiddlewareFunction[]) {
  return (baseReducer: Reducer): Reducer => {
    return (state: BuilderState, action: BuilderAction) => {
      let index = 0;
      const next: NextFunction = (s: BuilderState, a: BuilderAction): BuilderState => {
        if (index === middlewares.length) {
          return baseReducer(s, a);
        }
        const middleware = middlewares[index++];
        return middleware(s, a, (nextState, nextAction) => next(nextState, nextAction));
      };
      return next(state, action);
    };
  };
} 