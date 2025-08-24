"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const colors = [
 "#ef4444", // red
 "#f97316", // orange
 "#f59e0b", // amber
 "#eab308", // yellow
 "#84cc16", // lime
 "#22c55e", // green
 "#10b981", // emerald
 "#06b6d4", // cyan
 "#0ea5e9", // sky
 "#3b82f6", // blue
 "#6366f1", // indigo
 "#8b5cf6", // violet
 "#a855f7", // purple
 "#d946ef", // fuchsia
 "#ec4899", // pink
 "#f43f5e", // rose
 "#6b7280", // gray
 "#374151", // gray-700
]

interface ColorPickerProps {
 value: string
 onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
 return (
  <div className="grid grid-cols-9 gap-2">
   {colors.map((color) => (
    <Button
     key={color}
     type="button"
     variant="outline"
     size="sm"
     className={cn(
      "h-8 w-8 p-0 border-2",
      value === color ? "border-foreground" : "border-transparent hover:border-muted-foreground",
     )}
     style={{ backgroundColor: color }}
     onClick={() => onChange(color)}
    />
   ))}
  </div>
 )
}
