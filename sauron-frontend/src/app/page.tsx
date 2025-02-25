"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-indigo-800 to-purple-600 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            Design, Build, and Explore Firearms Your Way
          </h1>
          <p className="text-2xl md:text-3xl mb-8 max-w-3xl mx-auto">
            GunGuru empowers you to customize firearms with confidence through compatibility checks, legal compliance, and community insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/builder">Start Building</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURED BUILDS SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Builds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Example builds - these would come from the backend later */}
            {[
              {
                title: "Precision AR-15 DMR",
                author: "MasterBuilder",
                image: "/mock-build1.jpg",
                tags: ["AR-15", "DMR", "Long Range"],
                likes: 142
              },
              {
                title: "Lightweight Hiking Shotgun",
                author: "OutdoorsExpert",
                image: "/mock-build2.jpg",
                tags: ["Shotgun", "Lightweight", "Tactical"],
                likes: 98
              },
              {
                title: "Competition Glock 34",
                author: "RaceGunPro",
                image: "/mock-build3.jpg", 
                tags: ["Glock", "Competition", "Custom"],
                likes: 213
              }
            ].map((build, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-300 relative">
                  {/* Image placeholder - would use real images later */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    [Build Image]
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{build.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">❤️ {build.likes}</span>
                  </div>
                  <CardDescription>By {build.author}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2">
                    {build.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <Link href="/builds">View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/builds">View All Builds</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-md border">
              <CardHeader>
                <CardTitle className="text-xl">Interactive Builder</CardTitle>
                <CardDescription>
                  Design custom firearms with real-time compatibility checks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our hierarchical component system lets you select parts with confidence, 
                  ensuring every piece works together perfectly. View your creation in 
                  real-time as you build.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto" asChild>
                  <Link href="/builder">Try the Builder</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-md border">
              <CardHeader>
                <CardTitle className="text-xl">Legal Compliance</CardTitle>
                <CardDescription>
                  Stay informed about firearm laws in your state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Select your state to automatically check your build against local regulations.
                  Get real-time warnings about magazine capacity, barrel length, and other 
                  restricted features.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto" asChild>
                  <Link href="/laws">Check Laws</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-md border">
              <CardHeader>
                <CardTitle className="text-xl">Price Comparisons</CardTitle>
                <CardDescription>
                  Find the best deals on parts and accessories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Compare prices across multiple vendors for every component. 
                  Track price history and get alerts when items go on sale or 
                  come back in stock.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="mb-8 text-xl max-w-2xl mx-auto">
            Share your builds, learn from experts, and connect with fellow firearm enthusiasts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/guides">Browse Guides</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white" asChild>
              <Link href="/forums">Enter Forums</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER/ABOUT SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">About GunGuru</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            GunGuru is your ultimate free platform for firearm customization and education. 
            We provide interactive tools, accurate information, and a supportive community
            to help you build and understand firearms with confidence.
          </p>
          <Button variant="ghost" asChild>
            <Link href="/login">Create an Account</Link>
          </Button>
        </div>
      </section>
    </>
  )
} 