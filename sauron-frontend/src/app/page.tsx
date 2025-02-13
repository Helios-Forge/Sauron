"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  const handleScrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-indigo-800 to-purple-600 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            Welcome to Sauron
          </h1>
          <p className="text-2xl md:text-3xl mb-8 max-w-2xl mx-auto">
            Compare prices & compatibility of firearms, parts, and accessories—
            all in one free platform.
          </p>
          <Button size="lg" onClick={handleScrollToDemo}>
            Start Comparing
          </Button>
        </div>
      </section>

      {/* VISUAL DEMO SECTION */}
      <section id="demo" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">
            See Sauron In Action
          </h2>
          <div className="flex justify-center">
            <Card className="max-w-4xl">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Real-Time Data & Insights
                </CardTitle>
                <CardDescription>
                  Watch our platform instantly compare and analyze prices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Replace with an actual demo image or video */}
                <img
                  src="/demo-placeholder.png"
                  alt="Demo of Sauron App"
                  className="w-full rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Real-Time Updates</CardTitle>
                <CardDescription>
                  Get the latest pricing and stock info as it happens.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our live data feed ensures you're updated with the most recent
                  market changes.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Smart Comparisons</CardTitle>
                <CardDescription>
                  Advanced analytics at your fingertips.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Easily filter and compare products to make data-driven
                  decisions.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">
                  User-Friendly Interface
                </CardTitle>
                <CardDescription>
                  Designed with simplicity and efficiency in mind.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Navigate effortlessly with our modern and intuitive UI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SIGNUP / LOGIN SECTION */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Community</h2>
          <p className="mb-8 max-w-xl mx-auto">
            Sign up or login to personalize your experience and save your
            favorite comparisons.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" variant="outline" className="text-white border-white">
              Sign Up
            </Button>
            <Button size="lg" variant="secondary">
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">About Sauron</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sauron is your ultimate free tool for making informed decisions in
            the firearms ecosystem. We provide real-time data, smart comparisons,
            and an easy-to-use platform—all designed to empower you with
            cutting-edge insights.
          </p>
        </div>
      </section>
    </>
  )
} 