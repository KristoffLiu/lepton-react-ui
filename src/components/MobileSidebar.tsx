import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { MobileNavMain } from '@/components/MobileNavMain'
import { MobileNavProjects } from '@/components/MobileNavProjects'
import { NavUser } from '@/components/nav-user'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
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
import { 
  getUserCenterDomain, 
  getMemEchoDomain, 
  getMemEchoDocsDomain 
} from '@/lib/domain-utils'

interface MobileSidebarProps {
  onItemClick: () => void
}

export function MobileSidebar({ onItemClick }: MobileSidebarProps) {
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

  // 使用翻译的导航数据 - 完全复制ShadcnSidebar的内容
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
      {
        title: t('sidebar.navigation.memoryLibraries'),
        url: `${languagePrefix}/dashboard/memories`,
        icon: Database,
        isSingleItem: true,
      },
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
    <div className="flex h-full w-full flex-col">
      {/* Content - 复制NavMain和NavProjects，去掉Header */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-300 delay-100">
            <MobileNavMain 
              items={translatedData.navMain} 
              groupTitle={t('sidebar.dashboard')} 
              onMobileItemClick={onItemClick}
            />
            <MobileNavProjects 
              projects={translatedData.projects} 
              groupTitle={t('sidebar.productsAndServices')} 
              onMobileItemClick={onItemClick}
            />
          </div>
        </div>
      </div>
      
      {/* Footer - 复制语言切换器和用户信息 */}
      <div className="p-4 border-t animate-in slide-in-from-bottom-2 duration-300 delay-200">
        <div className="space-y-4">
          <LanguageSwitcher variant="sidebar" />
          <NavUser />
        </div>
      </div>
    </div>
  )
}
