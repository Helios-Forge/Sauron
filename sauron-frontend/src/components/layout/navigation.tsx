import { NavigationClient } from "./navigation-client"

const navigationItems = [
  {
    title: "Firearm Models",
    href: "/models",
    description: "Browse and manage firearm models and their specifications.",
  },
  {
    title: "Product Listings",
    href: "/listings",
    description: "View and compare product listings from various sellers.",
  },
  {
    title: "Compatibility Rules",
    href: "/compatibility",
    description: "Manage compatibility rules between parts and models.",
  },
  {
    title: "Parts Database",
    href: "/parts",
    description: "Browse and search the comprehensive parts database.",
  },
  {
    title: "Prebuilt Firearms",
    href: "/prebuilt",
    description: "Explore complete prebuilt firearm configurations.",
  },
] as const

export function Navigation() {
  return <NavigationClient items={navigationItems} />
} 