import { type LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

export interface MobileNavItem {
  title: string
  url: string
  icon?: LucideIcon
}

export interface MobileNavMainProps {
  items: MobileNavItem[]
  groupTitle?: string
  onClose?: () => void
  getIsActive?: (url: string, currentPath: string) => boolean
  currentPath?: string
  LinkComponent?: React.ComponentType<{ to: string; className?: string; onClick?: () => void; children: React.ReactNode }>
}

export function MobileNavMain({
  items,
  groupTitle = "功能",
  onClose,
  getIsActive,
  currentPath = "",
  LinkComponent,
}: MobileNavMainProps) {
  const DefaultLink: React.ComponentType<{ to: string; className?: string; onClick?: () => void; children: React.ReactNode }> = ({ to, className, onClick, children }) => {
    return (
      <a href={to} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  const Link = LinkComponent || DefaultLink

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{groupTitle}</h2>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = getIsActive
              ? getIsActive(item.url, currentPath)
              : currentPath === item.url || currentPath.startsWith(item.url + '/')
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

