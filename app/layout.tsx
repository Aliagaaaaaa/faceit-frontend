import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navigation } from "@/components/navigation"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-white dark:bg-[oklch(14.5%_0_0)] transition-colors">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  )
}
