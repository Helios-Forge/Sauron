import { Category } from './categories';

export const categoryConfig: Category[] = [
  {
    id: 'upper-assembly',
    name: 'Upper Assembly',
    slug: 'upper-assembly',
    parentId: null,
    children: [
      {
        id: 'bcg',
        name: 'Bolt Carrier Group (BCG)',
        slug: 'bcg',
        parentId: 'upper-assembly',
        children: [
          {
            id: 'bolt',
            name: 'Bolt',
            slug: 'bolt',
            parentId: 'bcg',
          },
          {
            id: 'bolt-carrier',
            name: 'Bolt Carrier',
            slug: 'bolt-carrier',
            parentId: 'bcg',
          },
          {
            id: 'firing-pin',
            name: 'Firing Pin',
            slug: 'firing-pin',
            parentId: 'bcg',
          },
          {
            id: 'firing-pin-retaining-pin',
            name: 'Firing Pin Retaining Pin',
            slug: 'firing-pin-retaining-pin',
            parentId: 'bcg',
          },
          {
            id: 'cam-pin',
            name: 'Cam Pin',
            slug: 'cam-pin',
            parentId: 'bcg',
          },
          {
            id: 'gas-key',
            name: 'Gas Key',
            slug: 'gas-key',
            parentId: 'bcg',
          },
          {
            id: 'gas-key-screws',
            name: 'Gas Key Screws',
            slug: 'gas-key-screws',
            parentId: 'bcg',
          },
          {
            id: 'extractor',
            name: 'Extractor',
            slug: 'extractor',
            parentId: 'bcg',
          },
          {
            id: 'extractor-spring',
            name: 'Extractor Spring',
            slug: 'extractor-spring',
            parentId: 'bcg',
          },
          {
            id: 'extractor-pin',
            name: 'Extractor Pin',
            slug: 'extractor-pin',
            parentId: 'bcg',
          },
          {
            id: 'ejector',
            name: 'Ejector',
            slug: 'ejector',
            parentId: 'bcg',
          },
          {
            id: 'ejector-spring',
            name: 'Ejector Spring',
            slug: 'ejector-spring',
            parentId: 'bcg',
          },
          {
            id: 'ejector-roll-pin',
            name: 'Ejector Roll Pin',
            slug: 'ejector-roll-pin',
            parentId: 'bcg',
          }
        ],
      },
      {
        id: 'barrel',
        name: 'Barrel',
        slug: 'barrel',
        parentId: 'upper-assembly',
        children: [
          {
            id: 'barrel-extension',
            name: 'Barrel Extension',
            slug: 'barrel-extension',
            parentId: 'barrel',
          },
          {
            id: 'barrel-nut',
            name: 'Barrel Nut',
            slug: 'barrel-nut',
            parentId: 'barrel',
          },
          {
            id: 'gas-block',
            name: 'Gas Block',
            slug: 'gas-block',
            parentId: 'barrel',
          },
          {
            id: 'gas-tube',
            name: 'Gas Tube',
            slug: 'gas-tube',
            parentId: 'barrel',
          },
          {
            id: 'muzzle-device',
            name: 'Muzzle Device',
            slug: 'muzzle-device',
            parentId: 'barrel',
            children: [
              {
                id: 'flash-suppressor',
                name: 'Flash Suppressor',
                slug: 'flash-suppressor',
                parentId: 'muzzle-device',
              },
              {
                id: 'muzzle-brake',
                name: 'Muzzle Brake',
                slug: 'muzzle-brake',
                parentId: 'muzzle-device',
              },
              {
                id: 'compensator',
                name: 'Compensator',
                slug: 'compensator',
                parentId: 'muzzle-device',
              },
              {
                id: 'suppressor',
                name: 'Silencer/Suppressor',
                slug: 'suppressor',
                parentId: 'muzzle-device',
              }
            ]
          },
          {
            id: 'thread-protector',
            name: 'Thread Protector',
            slug: 'thread-protector',
            parentId: 'barrel',
          },
          {
            id: 'barrel-shroud',
            name: 'Barrel Shroud',
            slug: 'barrel-shroud',
            parentId: 'barrel',
          }
        ],
      },
      {
        id: 'handguard',
        name: 'Handguard/Foregrip',
        slug: 'handguard',
        parentId: 'upper-assembly',
        children: [
          {
            id: 'free-float',
            name: 'Free-Float Handguard',
            slug: 'free-float',
            parentId: 'handguard',
          },
          {
            id: 'drop-in',
            name: 'Drop-In Handguard',
            slug: 'drop-in',
            parentId: 'handguard',
          },
          {
            id: 'rail-system',
            name: 'Rail System',
            slug: 'rail-system',
            parentId: 'handguard',
          },
          {
            id: 'heat-shield',
            name: 'Heat Shield',
            slug: 'heat-shield',
            parentId: 'handguard',
          },
          {
            id: 'foregrip',
            name: 'Foregrip',
            slug: 'foregrip',
            parentId: 'handguard',
          }
        ],
      },
      {
        id: 'upper-receiver',
        name: 'Upper Receiver',
        slug: 'upper-receiver',
        parentId: 'upper-assembly',
        children: [
          {
            id: 'stripped-upper',
            name: 'Stripped Upper Receiver',
            slug: 'stripped-upper',
            parentId: 'upper-receiver',
          },
          {
            id: 'complete-upper',
            name: 'Complete Upper Receiver',
            slug: 'complete-upper',
            parentId: 'upper-receiver',
          },
          {
            id: 'forward-assist',
            name: 'Forward Assist',
            slug: 'forward-assist',
            parentId: 'upper-receiver',
          },
          {
            id: 'forward-assist-spring',
            name: 'Forward Assist Spring',
            slug: 'forward-assist-spring',
            parentId: 'upper-receiver',
          },
          {
            id: 'forward-assist-pin',
            name: 'Forward Assist Pin',
            slug: 'forward-assist-pin',
            parentId: 'upper-receiver',
          },
          {
            id: 'dust-cover',
            name: 'Dust Cover',
            slug: 'dust-cover',
            parentId: 'upper-receiver',
          },
          {
            id: 'dust-cover-spring',
            name: 'Dust Cover Spring',
            slug: 'dust-cover-spring',
            parentId: 'upper-receiver',
          },
          {
            id: 'dust-cover-pin',
            name: 'Dust Cover Pin',
            slug: 'dust-cover-pin',
            parentId: 'upper-receiver',
          },
          {
            id: 'charging-handle',
            name: 'Charging Handle',
            slug: 'charging-handle',
            parentId: 'upper-receiver',
          },
          {
            id: 'charging-handle-latch',
            name: 'Charging Handle Latch',
            slug: 'charging-handle-latch',
            parentId: 'upper-receiver',
          }
        ],
      },
    ],
  },
  {
    id: 'lower-assembly',
    name: 'Lower Assembly',
    slug: 'lower-assembly',
    parentId: null,
    children: [
      {
        id: 'lower-receiver',
        name: 'Lower Receiver',
        slug: 'lower-receiver',
        parentId: 'lower-assembly',
        children: [
          {
            id: 'stripped-lower',
            name: 'Stripped Lower Receiver',
            slug: 'stripped-lower',
            parentId: 'lower-receiver',
          },
          {
            id: 'complete-lower',
            name: 'Complete Lower Receiver',
            slug: 'complete-lower',
            parentId: 'lower-receiver',
          },
          {
            id: 'receiver-extension',
            name: 'Receiver Extension (Buffer Tube)',
            slug: 'receiver-extension',
            parentId: 'lower-receiver',
          },
          {
            id: 'buffer-tube-castle-nut',
            name: 'Buffer Tube Castle Nut',
            slug: 'buffer-tube-castle-nut',
            parentId: 'lower-receiver',
          },
          {
            id: 'buffer-tube-end-plate',
            name: 'Buffer Tube End Plate',
            slug: 'buffer-tube-end-plate',
            parentId: 'lower-receiver',
          }
        ],
      },
      {
        id: 'trigger-assembly',
        name: 'Trigger Assembly',
        slug: 'trigger-assembly',
        parentId: 'lower-assembly',
        children: [
          {
            id: 'trigger',
            name: 'Trigger',
            slug: 'trigger',
            parentId: 'trigger-assembly',
          },
          {
            id: 'trigger-spring',
            name: 'Trigger Spring',
            slug: 'trigger-spring',
            parentId: 'trigger-assembly',
          },
          {
            id: 'trigger-pin',
            name: 'Trigger Pin',
            slug: 'trigger-pin',
            parentId: 'trigger-assembly',
          },
          {
            id: 'hammer',
            name: 'Hammer',
            slug: 'hammer',
            parentId: 'trigger-assembly',
          },
          {
            id: 'hammer-spring',
            name: 'Hammer Spring',
            slug: 'hammer-spring',
            parentId: 'trigger-assembly',
          },
          {
            id: 'hammer-pin',
            name: 'Hammer Pin',
            slug: 'hammer-pin',
            parentId: 'trigger-assembly',
          },
          {
            id: 'disconnector',
            name: 'Disconnector',
            slug: 'disconnector',
            parentId: 'trigger-assembly',
          },
          {
            id: 'disconnector-spring',
            name: 'Disconnector Spring',
            slug: 'disconnector-spring',
            parentId: 'trigger-assembly',
          },
          {
            id: 'trigger-guard',
            name: 'Trigger Guard',
            slug: 'trigger-guard',
            parentId: 'trigger-assembly',
          },
          {
            id: 'trigger-guard-roll-pin',
            name: 'Trigger Guard Roll Pin',
            slug: 'trigger-guard-roll-pin',
            parentId: 'trigger-assembly',
          }
        ],
      },
      {
        id: 'fire-control-group',
        name: 'Fire Control Group (FCG)',
        slug: 'fire-control-group',
        parentId: 'lower-assembly',
        children: [
          {
            id: 'safety-selector',
            name: 'Safety Selector',
            slug: 'safety-selector',
            parentId: 'fire-control-group',
          },
          {
            id: 'safety-selector-detent',
            name: 'Safety Selector Detent',
            slug: 'safety-selector-detent',
            parentId: 'fire-control-group',
          },
          {
            id: 'safety-selector-spring',
            name: 'Safety Selector Spring',
            slug: 'safety-selector-spring',
            parentId: 'fire-control-group',
          },
          {
            id: 'single-stage-trigger-kit',
            name: 'Single-Stage Trigger Kit',
            slug: 'single-stage-trigger-kit',
            parentId: 'fire-control-group',
          },
          {
            id: 'two-stage-trigger-kit',
            name: 'Two-Stage Trigger Kit',
            slug: 'two-stage-trigger-kit',
            parentId: 'fire-control-group',
          }
        ],
      },
      {
        id: 'magazine-release',
        name: 'Magazine Release',
        slug: 'magazine-release',
        parentId: 'lower-assembly',
        children: [
          {
            id: 'magazine-catch',
            name: 'Magazine Catch',
            slug: 'magazine-catch',
            parentId: 'magazine-release',
          },
          {
            id: 'magazine-catch-spring',
            name: 'Magazine Catch Spring',
            slug: 'magazine-catch-spring',
            parentId: 'magazine-release',
          },
          {
            id: 'magazine-catch-button',
            name: 'Magazine Catch Button',
            slug: 'magazine-catch-button',
            parentId: 'magazine-release',
          }
        ],
      },
      {
        id: 'bolt-catch',
        name: 'Bolt Catch',
        slug: 'bolt-catch',
        parentId: 'lower-assembly',
        children: [
          {
            id: 'bolt-catch-assembly',
            name: 'Bolt Catch',
            slug: 'bolt-catch-assembly',
            parentId: 'bolt-catch',
          },
          {
            id: 'bolt-catch-spring',
            name: 'Bolt Catch Spring',
            slug: 'bolt-catch-spring',
            parentId: 'bolt-catch',
          },
          {
            id: 'bolt-catch-roll-pin',
            name: 'Bolt Catch Roll Pin',
            slug: 'bolt-catch-roll-pin',
            parentId: 'bolt-catch',
          },
          {
            id: 'bolt-catch-plunger',
            name: 'Bolt Catch Plunger',
            slug: 'bolt-catch-plunger',
            parentId: 'bolt-catch',
          }
        ],
      },
      {
        id: 'buffer-system',
        name: 'Buffer System',
        slug: 'buffer-system',
        parentId: 'lower-assembly',
        children: [
          {
            id: 'buffer',
            name: 'Buffer',
            slug: 'buffer',
            parentId: 'buffer-system',
          },
          {
            id: 'buffer-spring',
            name: 'Buffer Spring',
            slug: 'buffer-spring',
            parentId: 'buffer-system',
          },
          {
            id: 'buffer-retainer',
            name: 'Buffer Retainer',
            slug: 'buffer-retainer',
            parentId: 'buffer-system',
          },
          {
            id: 'buffer-retainer-spring',
            name: 'Buffer Retainer Spring',
            slug: 'buffer-retainer-spring',
            parentId: 'buffer-system',
          }
        ],
      },
      {
        id: 'pistol-grip',
        name: 'Pistol Grip',
        slug: 'pistol-grip',
        parentId: 'lower-assembly',
        children: [
          {
            id: 'grip',
            name: 'Grip',
            slug: 'grip',
            parentId: 'pistol-grip',
          },
          {
            id: 'grip-screw',
            name: 'Grip Screw',
            slug: 'grip-screw',
            parentId: 'pistol-grip',
          },
          {
            id: 'grip-washer',
            name: 'Grip Washer',
            slug: 'grip-washer',
            parentId: 'pistol-grip',
          }
        ],
      },
      {
        id: 'stock',
        name: 'Stock',
        slug: 'stock',
        parentId: 'lower-assembly',
        children: [
          {
            id: 'fixed-stock',
            name: 'Fixed Stock',
            slug: 'fixed-stock',
            parentId: 'stock',
          },
          {
            id: 'collapsible-stock',
            name: 'Collapsible Stock',
            slug: 'collapsible-stock',
            parentId: 'stock',
          },
          {
            id: 'folding-stock',
            name: 'Folding Stock',
            slug: 'folding-stock',
            parentId: 'stock',
          },
          {
            id: 'stock-latch',
            name: 'Stock Latch',
            slug: 'stock-latch',
            parentId: 'stock',
          },
          {
            id: 'cheek-riser',
            name: 'Cheek Riser',
            slug: 'cheek-riser',
            parentId: 'stock',
          },
          {
            id: 'recoil-pad',
            name: 'Recoil Pad',
            slug: 'recoil-pad',
            parentId: 'stock',
          }
        ],
      }
    ],
  },
  {
    id: 'sights-optics',
    name: 'Sights and Optics',
    slug: 'sights-optics',
    parentId: null,
    children: [
      {
        id: 'iron-sights',
        name: 'Iron Sights',
        slug: 'iron-sights',
        parentId: 'sights-optics',
        children: [
          {
            id: 'front-sight-post',
            name: 'Front Sight Post',
            slug: 'front-sight-post',
            parentId: 'iron-sights',
          },
          {
            id: 'front-sight-base',
            name: 'Front Sight Base',
            slug: 'front-sight-base',
            parentId: 'iron-sights',
          },
          {
            id: 'rear-sight-aperture',
            name: 'Rear Sight Aperture',
            slug: 'rear-sight-aperture',
            parentId: 'iron-sights',
          },
          {
            id: 'rear-sight-base',
            name: 'Rear Sight Base',
            slug: 'rear-sight-base',
            parentId: 'iron-sights',
          },
          {
            id: 'sight-adjustment-tool',
            name: 'Sight Adjustment Tool',
            slug: 'sight-adjustment-tool',
            parentId: 'iron-sights',
          }
        ],
      },
      {
        id: 'optical-sights',
        name: 'Optical Sights',
        slug: 'optical-sights',
        parentId: 'sights-optics',
        children: [
          {
            id: 'red-dot',
            name: 'Red Dot Sight',
            slug: 'red-dot',
            parentId: 'optical-sights',
          },
          {
            id: 'holographic',
            name: 'Holographic Sight',
            slug: 'holographic',
            parentId: 'optical-sights',
          },
          {
            id: 'reflex',
            name: 'Reflex Sight',
            slug: 'reflex',
            parentId: 'optical-sights',
          },
          {
            id: 'magnified',
            name: 'Magnified Scope',
            slug: 'magnified',
            parentId: 'optical-sights',
          },
          {
            id: 'night-vision',
            name: 'Night Vision Scope',
            slug: 'night-vision',
            parentId: 'optical-sights',
          },
          {
            id: 'thermal',
            name: 'Thermal Scope',
            slug: 'thermal',
            parentId: 'optical-sights',
          }
        ],
      },
      {
        id: 'mounting-systems',
        name: 'Mounting Systems',
        slug: 'mounting-systems',
        parentId: 'sights-optics',
        children: [
          {
            id: 'scope-rings',
            name: 'Scope Rings',
            slug: 'scope-rings',
            parentId: 'mounting-systems',
          },
          {
            id: 'scope-mount',
            name: 'Scope Mount',
            slug: 'scope-mount',
            parentId: 'mounting-systems',
          },
          {
            id: 'rail-riser',
            name: 'Rail Riser',
            slug: 'rail-riser',
            parentId: 'mounting-systems',
          },
          {
            id: 'optic-base-plate',
            name: 'Optic Base Plate',
            slug: 'optic-base-plate',
            parentId: 'mounting-systems',
          }
        ],
      },
      {
        id: 'optics-accessories',
        name: 'Accessories',
        slug: 'optics-accessories',
        parentId: 'sights-optics',
        children: [
          {
            id: 'lens-covers',
            name: 'Lens Covers',
            slug: 'lens-covers',
            parentId: 'optics-accessories',
          },
          {
            id: 'anti-reflective-device',
            name: 'Anti-Reflective Device (ARD)',
            slug: 'anti-reflective-device',
            parentId: 'optics-accessories',
          },
          {
            id: 'kill-flash',
            name: 'Kill Flash',
            slug: 'kill-flash',
            parentId: 'optics-accessories',
          },
          {
            id: 'scope-turret-caps',
            name: 'Scope Turret Caps',
            slug: 'scope-turret-caps',
            parentId: 'optics-accessories',
          }
        ],
      }
    ],
  },
  {
    id: 'magazines-feeding',
    name: 'Magazines and Feeding Devices',
    slug: 'magazines-feeding',
    parentId: null,
    children: [
      {
        id: 'magazines',
        name: 'Magazines',
        slug: 'magazines',
        parentId: 'magazines-feeding',
        children: [
          {
            id: 'detachable-box-magazine',
            name: 'Detachable Box Magazine',
            slug: 'detachable-box-magazine',
            parentId: 'magazines',
          },
          {
            id: 'drum-magazine',
            name: 'Drum Magazine',
            slug: 'drum-magazine',
            parentId: 'magazines',
          },
          {
            id: 'extended-magazine',
            name: 'Extended Magazine',
            slug: 'extended-magazine',
            parentId: 'magazines',
          },
          {
            id: 'magazine-base-pad',
            name: 'Magazine Base Pad',
            slug: 'magazine-base-pad',
            parentId: 'magazines',
          },
          {
            id: 'magazine-follower',
            name: 'Magazine Follower',
            slug: 'magazine-follower',
            parentId: 'magazines',
          },
          {
            id: 'magazine-spring',
            name: 'Magazine Spring',
            slug: 'magazine-spring',
            parentId: 'magazines',
          }
        ],
      },
      {
        id: 'shotgun-shell-holders',
        name: 'Shotgun Shell Holders',
        slug: 'shotgun-shell-holders',
        parentId: 'magazines-feeding',
        children: [
          {
            id: 'side-saddle',
            name: 'Side Saddle',
            slug: 'side-saddle',
            parentId: 'shotgun-shell-holders',
          },
          {
            id: 'shell-carrier',
            name: 'Shell Carrier',
            slug: 'shell-carrier',
            parentId: 'shotgun-shell-holders',
          }
        ],
      },
      {
        id: 'speed-loaders',
        name: 'Speed Loaders',
        slug: 'speed-loaders',
        parentId: 'magazines-feeding',
        children: [
          {
            id: 'circular-speed-loader',
            name: 'Circular Speed Loader',
            slug: 'circular-speed-loader',
            parentId: 'speed-loaders',
          },
          {
            id: 'strip-speed-loader',
            name: 'Strip Speed Loader',
            slug: 'strip-speed-loader',
            parentId: 'speed-loaders',
          }
        ],
      },
      {
        id: 'magazine-accessories',
        name: 'Magazine Accessories',
        slug: 'magazine-accessories',
        parentId: 'magazines-feeding',
        children: [
          {
            id: 'magazine-coupler',
            name: 'Magazine Coupler',
            slug: 'magazine-coupler',
            parentId: 'magazine-accessories',
          },
          {
            id: 'magazine-loader-unloader',
            name: 'Magazine Loader/Unloader',
            slug: 'magazine-loader-unloader',
            parentId: 'magazine-accessories',
          },
          {
            id: 'magazine-extension-tube',
            name: 'Magazine Extension Tube',
            slug: 'magazine-extension-tube',
            parentId: 'magazine-accessories',
          }
        ],
      }
    ],
  },
  {
    id: 'muzzle-devices',
    name: 'Muzzle Devices and Barrel Accessories',
    slug: 'muzzle-devices',
    parentId: null,
    children: [
      {
        id: 'muzzle-devices-list',
        name: 'Muzzle Devices',
        slug: 'muzzle-devices-list',
        parentId: 'muzzle-devices',
        children: [
          {
            id: 'flash-hider',
            name: 'Flash Hider',
            slug: 'flash-hider',
            parentId: 'muzzle-devices-list',
          },
          {
            id: 'muzzle-brake',
            name: 'Muzzle Brake',
            slug: 'muzzle-brake',
            parentId: 'muzzle-devices-list',
          },
          {
            id: 'compensator',
            name: 'Compensator',
            slug: 'compensator',
            parentId: 'muzzle-devices-list',
          },
          {
            id: 'suppressor',
            name: 'Suppressor',
            slug: 'suppressor',
            parentId: 'muzzle-devices-list',
          },
          {
            id: 'linear-compensator',
            name: 'Linear Compensator',
            slug: 'linear-compensator',
            parentId: 'muzzle-devices-list',
          }
        ],
      },
      {
        id: 'barrel-accessories',
        name: 'Barrel Accessories',
        slug: 'barrel-accessories',
        parentId: 'muzzle-devices',
        children: [
          {
            id: 'barrel-nut-wrench',
            name: 'Barrel Nut Wrench',
            slug: 'barrel-nut-wrench',
            parentId: 'barrel-accessories',
          },
          {
            id: 'barrel-shims',
            name: 'Barrel Shims',
            slug: 'barrel-shims',
            parentId: 'barrel-accessories',
          },
          {
            id: 'crush-washer',
            name: 'Crush Washer',
            slug: 'crush-washer',
            parentId: 'barrel-accessories',
          },
          {
            id: 'peel-washer',
            name: 'Peel Washer',
            slug: 'peel-washer',
            parentId: 'barrel-accessories',
          },
          {
            id: 'thread-adapter',
            name: 'Thread Adapter',
            slug: 'thread-adapter',
            parentId: 'barrel-accessories',
          }
        ],
      }
    ],
  }
];

// Validate the category configuration
import { validateCategoryTree } from './categories';
if (!validateCategoryTree(categoryConfig)) {
  throw new Error('Invalid category configuration');
} 