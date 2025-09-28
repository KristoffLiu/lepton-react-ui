import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

// 临时导航配置，避免依赖不存在的配置文件
const mainNavigation = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: null
  },
  {
    title: 'Memories',
    href: '/dashboard/memories',
    icon: null
  }
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="flex flex-col gap-2">
      {mainNavigation.map((item) => {
        const isActive = location.pathname === item.href
        const Icon = item.icon

        return (
          <div key={item.href} className="flex flex-col gap-1">
            <Link
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/50',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.title}
            </Link>
          </div>
        )
      })}
    </nav>
  )
} 