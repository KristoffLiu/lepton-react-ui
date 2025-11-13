import * as React from "react"
import { cn } from "../../lib/utils"

export interface PageHeaderProps {
  title: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  icon, 
  actions, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col items-stretch space-y-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1">
          {icon && (
            <div className="mb-2">{icon}</div>
          )}
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export interface PageHeaderMobileProps {
  title: string
  className?: string
}

export function PageHeaderMobile({ 
  title,
  className
}: PageHeaderMobileProps) {
  return (
    <h1 className={cn("text-lg font-semibold truncate", className)}>{title}</h1>
  )
}

