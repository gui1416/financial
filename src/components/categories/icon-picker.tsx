"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getIconComponent, availableIcons } from "@/lib/icons"

interface IconPickerProps {
 value: string
 onChange: (icon: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
 return (
  <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
   {availableIcons.map((iconName) => {
    const IconComponent = getIconComponent(iconName)
    return (
     <Button
      key={iconName}
      type="button"
      variant="outline"
      size="sm"
      className={cn("h-8 w-8 p-0", value === iconName && "bg-accent")}
      onClick={() => onChange(iconName)}
     >
      <IconComponent className="h-4 w-4" />
     </Button>
    )
   })}
  </div>
 )
}
