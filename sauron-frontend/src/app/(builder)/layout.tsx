"use client"

import { BuilderProvider } from "@/contexts/BuilderContext"

export default function BuilderSharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BuilderProvider>
      {children}
    </BuilderProvider>
  )
} 