import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const itemVariants = cva(
  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-accent hover:text-accent-foreground",
        selected: "bg-accent text-accent-foreground",
        disabled: "opacity-50 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {
  selected?: boolean
  disabled?: boolean
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, selected, disabled, ...props }, ref) => {
    const computedVariant = disabled
      ? "disabled"
      : selected
      ? "selected"
      : variant

    return (
      <div
        ref={ref}
        className={cn(itemVariants({ variant: computedVariant }), className)}
        {...props}
      />
    )
  }
)
Item.displayName = "Item"

export { Item, itemVariants }

