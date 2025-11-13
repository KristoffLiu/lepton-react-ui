import {
  ChevronsUpDown,
  LogOut,
  User,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../shadcn/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../shadcn/sidebar"

export interface NavUserProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
  onProfileClick?: () => void
  LinkComponent?: React.ComponentType<{ to: string; children: React.ReactNode }>
  profileUrl?: string
}

export function NavUser({
  user,
  onLogout,
  onProfileClick,
  LinkComponent,
  profileUrl = "/profile",
}: NavUserProps) {
  const { isMobile } = useSidebar()

  const getAvatarFallback = (name: string) => {
    if (!name || name === "未登录用户") return "?"
    return name.charAt(0).toUpperCase()
  }

  const DefaultLink: React.ComponentType<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    return (
      <a href={to}>
        {children}
      </a>
    )
  }

  const Link = LinkComponent || DefaultLink

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{getAvatarFallback(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{getAvatarFallback(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild={!!LinkComponent} onClick={onProfileClick}>
                {LinkComponent ? (
                  <Link to={profileUrl}>
                    <User />
                    个人中心
                  </Link>
                ) : (
                  <>
                    <User />
                    个人中心
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

