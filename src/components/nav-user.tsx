import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { safeLogout } from '@/lib/sso'
import { getUserCenterDomain } from '@/lib/domain-utils'
import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/shadcn/sidebar"


export function NavUser() {
  const { isMobile } = useSidebar()
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const [apiUserInfo, setApiUserInfo] = useState<{
    name: string
    username?: string
  } | null>(null)
  const [isApiLoading, setIsApiLoading] = useState(false)

  // 获取当前语言前缀
  const getCurrentLanguagePrefix = () => {
    const path = location.pathname
    if (path.startsWith('/en')) return '/en'
    if (path.startsWith('/zh')) return '/zh'
    return '/zh' // 默认中文
  }

  const languagePrefix = getCurrentLanguagePrefix()

  // 从VITE_USERCENTER_API_URL获取name和username
  useEffect(() => {
    const loadApiUserInfo = async () => {
      if (!isAuthenticated || !user) {
        setIsApiLoading(false)
        setApiUserInfo(null)
        return
      }

      setIsApiLoading(true)
      try {
        const userCenterApiUrl = import.meta.env.VITE_USERCENTER_API_URL
        if (!userCenterApiUrl) {
          console.warn('VITE_USERCENTER_API_URL not configured')
          setIsApiLoading(false)
          setApiUserInfo(null)
          return
        }

        const apiUrl = `${userCenterApiUrl}/api/v1/users/me`
        console.log('正在从API获取name和username:', apiUrl)
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized - please login again')
            throw new Error('Unauthorized')
          }
          throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`)
        }

        const apiResponse = await response.json()
        console.log('从API获取的用户信息:', apiResponse)
        
        // 检查API响应结构
        if (!apiResponse.success || !apiResponse.content) {
          throw new Error('API响应格式错误')
        }
        
        const apiData = apiResponse.content
        
        // 只提取name和username
        const apiUserInfoData = {
          name: apiData.extra_profile?.name || apiData.name || '',
          username: apiData.username || apiData.unique_id || undefined,
        }
        
        setApiUserInfo(apiUserInfoData)
        console.log('成功获取name和username:', apiUserInfoData)
        
      } catch (error) {
        console.error('从API获取name和username失败:', error)
        // API获取失败，不显示name和username
        setApiUserInfo(null)
      } finally {
        setIsApiLoading(false)
      }
    }

    loadApiUserInfo()
  }, [isAuthenticated, user])

  const handleLogout = () => {
    safeLogout()
  }

  // 如果用户未认证，显示默认信息
  if (!isAuthenticated || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">?</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Not logged in</span>
              <span className="truncate text-xs">Please login</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

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
                {user.avatar && user.avatar !== '/favicon.png' ? (
                  <AvatarImage src={user.avatar} alt={apiUserInfo?.name || user.email} />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    {apiUserInfo?.name ? apiUserInfo.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {apiUserInfo?.name && (
                  <span className="truncate font-semibold">{apiUserInfo.name}</span>
                )}
                <span className="truncate text-xs">{user.email}</span>
                {/* {apiUserInfo?.username && (
                  <span className="truncate text-xs text-muted-foreground">@{apiUserInfo.username}</span>
                )} */}
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
                  {user.avatar && user.avatar !== '/favicon.png' ? (
                    <AvatarImage src={user.avatar} alt={apiUserInfo?.name || user.email} />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {apiUserInfo?.name ? apiUserInfo.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {apiUserInfo?.name && (
                    <span className="truncate font-semibold">{apiUserInfo.name}</span>
                  )}
                  <span className="truncate text-xs">{user.email}</span>
                  {apiUserInfo?.username && (
                    <span className="truncate text-xs text-muted-foreground">@{apiUserInfo.username}</span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href={`${getUserCenterDomain()}${languagePrefix}/dashboard/profile`} target="_blank" rel="noopener noreferrer">
                  <BadgeCheck />
                  Account
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`${getUserCenterDomain()}${languagePrefix}/dashboard/billing`} target="_blank" rel="noopener noreferrer">
                  <CreditCard />
                  Billing
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
