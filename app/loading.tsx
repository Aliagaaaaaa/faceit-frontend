import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="text-lg">Loading CS2 matches...</span>
      </div>
    </div>
  )
}
