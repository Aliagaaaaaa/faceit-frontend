"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-100 dark:bg-[oklch(18%_0_0)] border-b border-gray-200 dark:border-[oklch(22%_0_0)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-gray-200 dark:bg-[oklch(22%_0_0)] text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              Live Matches
            </Link>
            <Link
              href="/ranking"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/ranking"
                  ? "bg-gray-200 dark:bg-[oklch(22%_0_0)] text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              Ranking
            </Link>
          </div>

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
