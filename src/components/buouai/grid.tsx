import { useMemo } from "react"
import { cn } from "@/lib/utils"
import React from "react"

export function Grid({
    children,
    className,
    contentClassName,
    gradient = true,
    gradientWidth = 50,
    size = 40,
  }: {
    children: React.ReactNode
    className?: string
    contentClassName?: string
    gradient?: boolean
    gradientWidth?: number | string
    size?: number
  }) {
    const gradientColor = "hsl(var(--background))" // 引用 Tailwind CSS 变量
    const gradientStyle = useMemo(
      () => ({
        ["--gradient-color" as string]: gradientColor,
        ["--gradient-width" as string]:
          typeof gradientWidth === "number"
            ? `${gradientWidth}px`
            : gradientWidth,
      }),
      [gradientColor, gradientWidth]
    )
    return (
      <div
        className={cn(
          `bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)]`,
          className
        )}
        style={{ backgroundSize: `${size}px ${size}px`, right:"40%"}}
      >
        <div className={cn("relative", contentClassName)}>{children}</div>
        {gradient && (
          <div style={gradientStyle}>
            <div
              className={cn(
                "absolute top-0 left-0 h-full w-[var(--gradient-width)] z-2 pointer-events-none",
                "bg-gradient-to-r from-[var(--gradient-color)] to-transparent ",
                "hidden md:block"
              )}
            />
            <div
              className={cn(
                "absolute top-0 right-0 h-full w-[var(--gradient-width)] z-2 pointer-events-none transform rotate-180",
                "bg-gradient-to-r from-[var(--gradient-color)] to-transparent ",
                "hidden md:block"
              )}
            />
          </div>
        )}
      </div>
    )
  }