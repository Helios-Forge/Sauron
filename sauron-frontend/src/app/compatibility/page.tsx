"use client"

import { CompatibilityRuleList } from "@/components/compatibility/compatibility-rule-list"

export default function CompatibilityPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Compatibility Rules</h1>
      <CompatibilityRuleList />
    </div>
  )
} 