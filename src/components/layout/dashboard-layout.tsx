import * as React from "react"
import { Button } from "../shadcn/button"
import { X, Menu } from "lucide-react"
import { SidebarProvider } from "../shadcn/sidebar"
import { PageHeaderMobile } from "./page-header"
import { cn } from "../../lib/utils"

export interface DashboardLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  mobileSidebar?: React.ReactNode
  mobileSidebarTitle?: string
  getPageTitle?: (pathname: string) => string
  pathname?: string
  className?: string
  contentClassName?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "max-w-full",
}

export function DashboardLayout({
  children,
  sidebar,
  mobileSidebar,
  mobileSidebarTitle = "应用",
  getPageTitle,
  pathname = typeof window !== 'undefined' ? window.location.pathname : '',
  className,
  contentClassName,
  maxWidth = "5xl",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  
  const pageTitle = getPageTitle && pathname ? getPageTitle(pathname) : undefined

  return (
    <SidebarProvider>
      <div className={cn("min-h-screen bg-background w-full", className)}>
        {/* Mobile sidebar overlay */}
        <div className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className={cn(
            "fixed inset-0 bg-background transform transition-transform duration-300 ease-in-out flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="flex h-16 items-center justify-between px-4 border-b bg-background flex-shrink-0">
              <h1 className="text-lg font-semibold">{mobileSidebarTitle}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {mobileSidebar || sidebar}
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          {sidebar}
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-40">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">打开侧边栏</span>
            </Button>
            <div className="flex-1 flex justify-center">
              {pageTitle && (
                <PageHeaderMobile title={pageTitle} />
              )}
            </div>
            <div className="w-10" />
          </div>
          
          {/* Page content with responsive max-width */}
          <main className={cn("py-4 sm:py-6", contentClassName)}>
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
              <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth])}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

