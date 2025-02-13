import { redirect } from "next/navigation"

export default function FirearmsPage() {
  redirect("/catalog?category=firearms")
}