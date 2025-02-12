import type { Category } from './categories';

export const categoryConfig: Category[] = [
  {
    id: 'upper',
    name: 'Upper Receiver',
    description: 'Upper receiver components',
    children: [
      {
        id: 'bcg',
        name: 'Bolt Carrier Group',
        description: 'Bolt carrier group components',
        parentId: 'upper',
      },
      {
        id: 'charging-handle',
        name: 'Charging Handle',
        description: 'Charging handle components',
        parentId: 'upper',
      },
    ],
  },
  {
    id: 'lower',
    name: 'Lower Receiver',
    description: 'Lower receiver components',
    children: [
      {
        id: 'trigger',
        name: 'Trigger Group',
        description: 'Trigger group components',
        parentId: 'lower',
      },
      {
        id: 'grip',
        name: 'Grip',
        description: 'Grip components',
        parentId: 'lower',
      },
    ],
  },
  // Add more categories as needed
]; 