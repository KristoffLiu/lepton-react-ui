import {
  type LucideIcon,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"

export function MobileNavProjects({
  projects,
  groupTitle = "Projects",
  onMobileItemClick,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    isSingleItem?: boolean
  }[]
  groupTitle?: string
  onMobileItemClick?: () => void
}) {
  const isMobile = useIsMobile()

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-foreground mb-4">{groupTitle}</h3>
      <div className="space-y-1">
        {projects.map((item) => {
          const isSingleItem = item.isSingleItem
          
          // 如果是独立按钮（带星号），直接渲染为链接
          if (isSingleItem) {
            return (
              <div key={item.name}>
                <Link 
                  to={item.url}
                  className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    if (isMobile && onMobileItemClick) {
                      onMobileItemClick()
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </div>
            )
          }
          
          // 如果有子菜单，渲染为带下拉菜单的项
          return (
            <div key={item.name}>
              <Link 
                to={item.url}
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  if (isMobile && onMobileItemClick) {
                    onMobileItemClick()
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
