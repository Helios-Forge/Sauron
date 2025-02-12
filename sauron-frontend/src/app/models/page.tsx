"use client"

import { FirearmModelList } from "@/components/firearm-models/firearm-model-list"

export default function ModelsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Firearm Models</h1>
      <FirearmModelList />
    </div>
  )
} 