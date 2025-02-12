import {
  Part,
  AssemblyPart,
  SubcomponentPart,
  StandalonePart,
  MockDataConfig,
  CompatibilityRule,
} from '@/types/builder';

// Mock BCG (Bolt Carrier Group) Assembly
export const bcgAssembly: AssemblyPart = {
  id: 'bcg-complete-mil-spec',
  type: 'ASSEMBLY',
  name: 'Complete Mil-Spec BCG',
  categoryId: 'bcg',
  price: 129.99,
  description: 'Military specification bolt carrier group',
  subcomponents: [
    { categoryId: 'bolt', partId: 'bcg-bolt-mil-spec', isReplaceable: true },
    { categoryId: 'carrier', partId: 'bcg-carrier-mil-spec', isReplaceable: true },
    { categoryId: 'gas-key', partId: 'bcg-gas-key-mil-spec', isReplaceable: true },
    { categoryId: 'firing-pin', partId: 'bcg-firing-pin-mil-spec', isReplaceable: true },
    { categoryId: 'cam-pin', partId: 'bcg-cam-pin-mil-spec', isReplaceable: true },
  ],
};

// BCG Subcomponents
export const bcgSubcomponents: SubcomponentPart[] = [
  {
    id: 'bcg-bolt-mil-spec',
    type: 'SUBCOMPONENT',
    name: 'Mil-Spec Bolt',
    categoryId: 'bolt',
    price: 39.99,
    isReplaceable: true,
    parentAssemblyId: 'bcg-complete-mil-spec',
  },
  {
    id: 'bcg-carrier-mil-spec',
    type: 'SUBCOMPONENT',
    name: 'Mil-Spec Carrier',
    categoryId: 'carrier',
    price: 49.99,
    isReplaceable: true,
    parentAssemblyId: 'bcg-complete-mil-spec',
  },
  {
    id: 'bcg-gas-key-mil-spec',
    type: 'SUBCOMPONENT',
    name: 'Mil-Spec Gas Key',
    categoryId: 'gas-key',
    price: 14.99,
    isReplaceable: true,
    parentAssemblyId: 'bcg-complete-mil-spec',
  },
  {
    id: 'bcg-firing-pin-mil-spec',
    type: 'SUBCOMPONENT',
    name: 'Mil-Spec Firing Pin',
    categoryId: 'firing-pin',
    price: 9.99,
    isReplaceable: true,
    parentAssemblyId: 'bcg-complete-mil-spec',
  },
  {
    id: 'bcg-cam-pin-mil-spec',
    type: 'SUBCOMPONENT',
    name: 'Mil-Spec Cam Pin',
    categoryId: 'cam-pin',
    price: 7.99,
    isReplaceable: true,
    parentAssemblyId: 'bcg-complete-mil-spec',
  },
];

// Standalone Parts
const standaloneParts: StandalonePart[] = [
  {
    id: 'barrel-16-556',
    type: 'STANDALONE',
    name: '16" 5.56 NATO Barrel',
    categoryId: 'barrel',
    price: 199.99,
    description: '16 inch chrome-lined barrel for 5.56 NATO',
  },
  {
    id: 'handguard-15-mlok',
    type: 'STANDALONE',
    name: '15" M-LOK Handguard',
    categoryId: 'handguard',
    price: 159.99,
    description: '15 inch free-float M-LOK handguard',
  },
];

// Replacement Parts (for BCG subcomponents)
const replacementParts: SubcomponentPart[] = [
  {
    id: 'bcg-bolt-enhanced',
    type: 'SUBCOMPONENT',
    name: 'Enhanced Bolt',
    categoryId: 'bolt',
    price: 79.99,
    isReplaceable: true,
    description: 'Enhanced bolt with improved material and coating',
  },
  {
    id: 'bcg-carrier-lightweight',
    type: 'SUBCOMPONENT',
    name: 'Lightweight Carrier',
    categoryId: 'carrier',
    price: 89.99,
    isReplaceable: true,
    description: 'Lightweight carrier for competition use',
  },
];

// Compatibility Rules
const compatibilityRules: CompatibilityRule[] = [
  {
    categoryId: 'barrel',
    compatibleWith: [
      {
        categoryId: 'handguard',
        condition: (barrel: Part, handguard: Part) => {
          // Example: Check if handguard length is appropriate for barrel length
          const barrelLength = Number(barrel.name.split('"')[0]);
          const handguardLength = Number(handguard.name.split('"')[0]);
          return handguardLength <= barrelLength - 0.75; // 0.75" clearance
        },
      },
    ],
  },
  {
    categoryId: 'bolt',
    compatibleWith: [
      {
        categoryId: 'carrier',
        // Example: Ensure bolt and carrier are compatible (e.g., both mil-spec or both enhanced)
        condition: (bolt: Part, carrier: Part) => {
          const isBoltMilSpec = bolt.name.toLowerCase().includes('mil-spec');
          const isCarrierMilSpec = carrier.name.toLowerCase().includes('mil-spec');
          return isBoltMilSpec === isCarrierMilSpec;
        },
      },
    ],
  },
];

// Complete mock data configuration
export const mockData: MockDataConfig = {
  parts: [
    bcgAssembly,
    ...bcgSubcomponents,
    ...standaloneParts,
    ...replacementParts,
  ],
  assemblies: [
    {
      mainPartId: bcgAssembly.id,
      includedParts: bcgAssembly.subcomponents,
    },
  ],
  compatibilityRules,
};

// Helper function to get all parts for a category
export function getMockPartsForCategory(categoryId: string): Part[] {
  return mockData.parts.filter(part => part.categoryId === categoryId);
}

// Helper function to get a specific part by ID
export function getMockPartById(partId: string): Part | undefined {
  return mockData.parts.find(part => part.id === partId);
}

// Helper function to get all replacement options for a subcomponent
export function getMockReplacementParts(categoryId: string): SubcomponentPart[] {
  return mockData.parts.filter(
    (part): part is SubcomponentPart =>
      part.type === 'SUBCOMPONENT' &&
      part.categoryId === categoryId &&
      !part.parentAssemblyId // Only get parts that aren't already part of an assembly
  );
} 