"use client";

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">GunGuru</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-700 p-6 no-underline outline-none focus:shadow-md"
                          href="/catalog"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Product Catalog
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Browse our extensive catalog of firearm parts and accessories
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/catalog?category=parts" title="Parts">
                      Firearm parts for customization and replacement
                    </ListItem>
                    <ListItem href="/catalog?category=accessories" title="Accessories">
                      Enhance your firearm with quality accessories
                    </ListItem>
                    <ListItem href="/catalog?category=prebuilt" title="Pre-Built Firearms">
                      Ready-to-use firearms from top manufacturers
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/builder" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Builder
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <ListItem href="/about" title="About Us">
                      Learn about our mission and team
                    </ListItem>
                    <ListItem href="/contact" title="Contact">
                      Get in touch with our support team
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>GunGuru</SheetTitle>
                <SheetDescription>
                  Firearm customization platform
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 flex flex-col space-y-4">
                <Link href="/" className="px-4 py-2 text-lg font-medium">
                  Home
                </Link>
                <Link href="/catalog" className="px-4 py-2 text-lg font-medium">
                  Products
                </Link>
                <Link href="/builder" className="px-4 py-2 text-lg font-medium">
                  Builder
                </Link>
                <Link href="/about" className="px-4 py-2 text-lg font-medium">
                  About
                </Link>
                <Link href="/contact" className="px-4 py-2 text-lg font-medium">
                  Contact
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                <Link href="/auth/login" className="px-4 py-2 text-lg font-medium">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"; 