import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../shadcn/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../shadcn/sidebar"
import { useIsMobile } from "../../hooks/use-mobile"
import { cn } from "../../lib/utils"

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  isSingleItem?: boolean
  isAlwaysExpanded?: boolean
  badge?: string
  items?: {
    title: string
    url: string
    disabled?: boolean
  }[]
}

export interface NavMainProps {
  items: NavItem[]
  groupTitle?: string
  onClose?: () => void
  getIsActive?: (url: string, currentPath: string) => boolean
  currentPath?: string
  LinkComponent?: React.ComponentType<{ to: string; className?: string; onClick?: () => void; children: React.ReactNode }>
}

export function NavMain({
  items,
  groupTitle = "Platform",
  onClose,
  getIsActive,
  currentPath = "",
  LinkComponent,
}: NavMainProps) {
  const isMobile = useIsMobile()
  
  const buttonSize = isMobile ? "lg" : "default"

  // 默认的 Link 组件（如果没有提供）
  const DefaultLink: React.ComponentType<{ to: string; className?: string; onClick?: () => void; children: React.ReactNode }> = ({ to, className, onClick, children }) => {
    return (
      <a href={to} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  const Link = LinkComponent || DefaultLink

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = getIsActive 
            ? getIsActive(item.url, currentPath)
            : currentPath === item.url || currentPath.startsWith(item.url + '/')
          const hasSubItems = item.items && item.items.length > 0
          const isSingleItem = item.isSingleItem
          const isAlwaysExpanded = item.isAlwaysExpanded
          
          if (isSingleItem) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size={buttonSize} isActive={isActive}>
                  <Link 
                    to={item.url}
                    onClick={onClose}
                    className={cn(isActive && "!bg-sidebar-accent !font-medium !text-sidebar-accent-foreground")}
                    data-active={isActive ? "true" : "false"}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 ring-1 ring-inset ring-orange-600/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
          
          if (hasSubItems) {
            return (
              <Collapsible key={item.title} asChild defaultOpen={isAlwaysExpanded || isActive}>
                <SidebarMenuItem>
                  {isAlwaysExpanded ? (
                    <SidebarMenuButton asChild tooltip={item.title} size={buttonSize} isActive={isActive}>
                      <Link 
                        to={item.url}
                        onClick={onClose}
                        className={cn(isActive && "!bg-sidebar-accent !font-medium !text-sidebar-accent-foreground")}
                        data-active={isActive ? "true" : "false"}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 rotate-90" />
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} size={buttonSize} isActive={isActive}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  )}
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubActive = getIsActive
                          ? getIsActive(subItem.url, currentPath)
                          : currentPath === subItem.url
                        const isDisabled = !!subItem.disabled
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            {isDisabled ? (
                              <SidebarMenuSubButton
                                isActive={false}
                                aria-disabled
                                size="md"
                                className={isMobile ? "h-10 text-base" : ""}
                                onClick={(e) => {
                                  e.preventDefault()
                                  return false
                                }}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            ) : (
                              <SidebarMenuSubButton asChild size="md" isActive={isSubActive} className={isMobile ? "h-10 text-base" : ""}>
                                <Link
                                  to={subItem.url}
                                  onClick={onClose}
                                  className={cn(isSubActive && "!bg-sidebar-accent !font-medium !text-sidebar-accent-foreground")}
                                  data-active={isSubActive ? "true" : "false"}
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
          
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link 
                  to={item.url}
                  onClick={onClose}
                  className={cn(isActive && "!bg-sidebar-accent !font-medium !text-sidebar-accent-foreground")}
                  data-active={isActive ? "true" : "false"}
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

