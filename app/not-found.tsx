import { redirect } from "next/navigation";

// Redirect all unmatched routes to the homepage (/)
export default function NotFound() {
  redirect("/");
} 