import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/shadcn/sidebar"

export function NavMain({
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
    <SidebarGroup>
      <SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname === item.url
          const hasSubItems = item.items && item.items.length > 0
          const isSingleItem = item.isSingleItem
          
          // 如果是独立按钮（带星号），直接渲染为链接
          if (isSingleItem) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link 
                    to={item.url}
                    className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                    onClick={() => {
                      if (isMobile && onMobileItemClick) {
                        onMobileItemClick()
                      }
                    }}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
          
          // 如果有子菜单，渲染为可折叠项
          if (hasSubItems) {
            return (
              <Collapsible key={item.title} asChild defaultOpen={isActive}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubActive = location.pathname === subItem.url
                        const isDisabled = !!subItem.disabled
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            {isDisabled ? (
                              <SidebarMenuSubButton
                                isActive={false}
                                aria-disabled
                                onClick={(e) => {
                                  e.preventDefault()
                                  return false
                                }}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            ) : (
                              <SidebarMenuSubButton asChild>
                                <Link
                                  to={subItem.url}
                                  className={isSubActive ? "text-sidebar-accent-foreground" : ""}
                                  onClick={() => {
                                    if (isMobile && onMobileItemClick) {
                                      onMobileItemClick()
                                    }
                                  }}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            )}
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }
          
          // 默认情况，渲染为普通链接
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link 
                  to={item.url}
                  className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  onClick={() => {
                    if (isMobile && onMobileItemClick) {
                      onMobileItemClick()
                    }
                  }}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
