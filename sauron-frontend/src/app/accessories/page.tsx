import { redirect } from "next/navigation"

export default function AccessoriesPage() {
  redirect("/catalog?category=accessories")
}