import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible"

export function MobileNavMain({
  items,
  groupTitle = "Platform",
  onMobileItemClick,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    isSingleItem?: boolean
    items?: {
      title: string
      url: string
      disabled?: boolean
    }[]
  }[]
  groupTitle?: string
  onMobileItemClick?: () => void
}) {
  const location = useLocation()
  const isMobile = useIsMobile()

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-foreground mb-4"></h3>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.url
          const hasSubItems = item.items && item.items.length > 0
          const isSingleItem = item.isSingleItem
          
          // 如果是独立按钮（带星号），直接渲染为链接
          if (isSingleItem) {
            return (
              <div key={item.title}>
                <Link 
                  to={item.url}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                  }`}
                  onClick={() => {
                    if (isMobile && onMobileItemClick) {
                      onMobileItemClick()
                    }
                  }}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span>{item.title}</span>
                </Link>
              </div>
            )
          }
          
          // 如果有子菜单，渲染为可折叠项
          if (hasSubItems) {
            return (
              <Collapsible key={item.title} asChild defaultOpen={isActive}>
                <div>
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-8 mt-2 space-y-1">
                      {item.items?.map((subItem) => {
                        const isSubActive = location.pathname === subItem.url
                        const isDisabled = !!subItem.disabled
                        return (
                          <div key={subItem.title}>
                            {isDisabled ? (
                              <button
                                className="flex w-full items-center space-x-3 rounded-lg px-4 py-2 text-sm text-muted-foreground cursor-not-allowed"
                                disabled
                              >
                                <span>{subItem.title}</span>
                              </button>
                            ) : (
                              <Link
                                to={subItem.url}
                                className={`flex items-center space-x-3 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                                  isSubActive ? "text-accent-foreground bg-accent/50" : "text-muted-foreground"
                                }`}
                                onClick={() => {
                                  if (isMobile && onMobileItemClick) {
                                    onMobileItemClick()
                                  }
                                }}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          }
          
          // 默认情况，渲染为普通链接
          return (
            <div key={item.title}>
              <Link 
                to={item.url}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                }`}
                onClick={() => {
                  if (isMobile && onMobileItemClick) {
                    onMobileItemClick()
                  }
                }}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.title}</span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
