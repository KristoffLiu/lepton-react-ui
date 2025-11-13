import * as React from "react"
import { cn } from "../../lib/utils"
import { PageHeader, PageHeaderProps } from "./page-header"

export interface PageContainerProps {
  title?: string
  children: React.ReactNode
  className?: string
  showHeader?: boolean
  headerProps?: Omit<PageHeaderProps, 'title'>
}

export function PageContainer({ 
  title,
  children, 
  className,
  showHeader = true,
  headerProps
}: PageContainerProps) {
  return (
    <div className={cn("space-y-6 pt-0 lg:pt-8", className)}>
      {showHeader && title && (
        <div className="hidden lg:block">
          <PageHeader
            title={title}
            {...headerProps}
          />
        </div>
      )}
      
      {children}
    </div>
  )
}

export interface PageContainerNoHeaderProps {
  children: React.ReactNode
  className?: string
}

export function PageContainerNoHeader({ 
  children, 
  className 
}: PageContainerNoHeaderProps) {
  return (
    <div className={cn("space-y-6 pt-4 lg:pt-8", className)}>
      {children}
    </div>
  )
}

