import * as React from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from 'react-router-dom'
import {
  Database,
  Key,
  CreditCard,
  FileText,
  Home,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  BarChart3,
  HelpCircle,
  Globe,
  Server,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/sidebar"
import { 
  getUserCenterDomain, 
  getMemEchoDomain, 
  getMemEchoDocsDomain 
} from "@/lib/domain-utils"

export function ShadcnSidebar({ 
  onMobileItemClick,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  onMobileItemClick?: () => void
}) {
  const { t } = useTranslation('common')
  const location = useLocation()
  
  // 获取当前语言前缀
  const getCurrentLanguagePrefix = () => {
    const path = location.pathname
    if (path.startsWith('/en')) return '/en'
    if (path.startsWith('/zh')) return '/zh'
    return '/zh' // 默认中文
  }
  
  const languagePrefix = getCurrentLanguagePrefix()

  // 使用翻译的导航数据
  const translatedData = {
    teams: [
      {
        name: "MemEcho",
        logo: GalleryVerticalEnd,
        plan: t('sidebar.teams.plan'),
      },
      {
        name: "MemEcho",
        logo: AudioWaveform,
        plan: t('sidebar.teams.plan'),
      },
      {
        name: "MemEcho",
        logo: Command,
        plan: t('sidebar.teams.plan'),
      },
    ],
    navMain: [
      {
        title: t('sidebar.navigation.overview'),
        url: `${languagePrefix}/dashboard`,
        icon: Home,
        isActive: true,
        isSingleItem: true,
      },
      // 暂时隐藏操作页面
      // {
      //   title: t('sidebar.navigation.memoryAndSessions'),
      //   url: `${languagePrefix}/dashboard/sessions`,
      //   icon: Clock,
      //   isSingleItem: true,
      // },
      {
        title: t('sidebar.navigation.memoryLibraries'),
        url: `${languagePrefix}/dashboard/memories`,
        icon: Database,
        isSingleItem: true,
      },
      // 暂时隐藏设置页面
      // {
      //   title: t('sidebar.navigation.settings'),
      //   url: `${languagePrefix}/dashboard/settings`,
      //   icon: Settings,
      //   isSingleItem: true,
      // },
      {
        title: t('sidebar.navigation.usageStats'),
        url: `${languagePrefix}/dashboard/usage`,
        icon: BarChart3,
        items: [
          {
            title: t('sidebar.navigation.subItems.usageOverview'),
            url: `${languagePrefix}/dashboard/usage`,
          },
          {
            title: t('sidebar.navigation.subItems.requestDetails'),
            url: `${languagePrefix}/dashboard/usage/requests`,
          },
          {
            title: t('sidebar.navigation.subItems.performanceAnalysis'),
            url: `${languagePrefix}/dashboard/usage/performance`,
          },
        ],
      },
    ],
    projects: [
      {
        name: t('sidebar.projects.subscriptionManagement'),
        url: getUserCenterDomain(),
        icon: CreditCard,
        isSingleItem: true,
      },
      {
        name: t('sidebar.projects.documentationCenter'),
        url: getMemEchoDocsDomain(),
        icon: FileText,
        isSingleItem: true,
      },
      {
        name: t('sidebar.projects.officialWebsite'),
        url: getMemEchoDomain(),
        icon: Globe,
        isSingleItem: true,
      },
    ],
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={translatedData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain 
          items={translatedData.navMain} 
          groupTitle={t('sidebar.dashboard')} 
          onMobileItemClick={onMobileItemClick}
        />
        <NavProjects 
          projects={translatedData.projects} 
          groupTitle={t('sidebar.productsAndServices')} 
          onMobileItemClick={onMobileItemClick}
        />
      </SidebarContent>
      <SidebarFooter>
        {/* 语言切换器 */}
        <LanguageSwitcher variant="sidebar" />
        {/* 用户信息 */}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
