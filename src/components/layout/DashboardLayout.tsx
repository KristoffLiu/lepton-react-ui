import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/shadcn/button'
import { X, Menu } from 'lucide-react'
import { ShadcnSidebar } from './ShadcnSidebar'
import { MobileSidebar } from '@/components/MobileSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { usePageTitle } from '@/contexts/PageTitleContext'

export default function DashboardLayout() {
  const { t } = useTranslation('common')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()
  const { pageTitle } = usePageTitle()

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full">
        {/* Mobile sidebar overlay */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div 
            className={`fixed inset-0 bg-black/80 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setSidebarOpen(false)} 
          />
          <div className={`fixed left-0 top-0 h-full w-full bg-background transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Mobile sidebar header */}
            <div className="flex h-16 items-center justify-between px-4 border-b bg-background sticky top-0 z-40 animate-in slide-in-from-left-4 duration-300">
              <h1 className="text-lg font-semibold">{t('sidebar.mobile.dashboardTitle')}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="transition-opacity duration-200 delay-100 hover:bg-accent"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">{t('sidebar.mobile.closeSidebar')}</span>
              </Button>
            </div>
            {/* Sidebar content */}
            <div className="h-[calc(100vh-4rem)] overflow-hidden">
              <MobileSidebar onItemClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <ShadcnSidebar />
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Mobile header with trigger button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('sidebar.mobile.openSidebar')}</span>
            </Button>
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
            <div className="w-10" /> {/* 占位符，保持标题居中 */}
          </div>
          
          {/* Page content */}
          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
              {/* 响应式容器：限制最大宽度，在大屏幕上居中显示 */}
              <div className="mx-auto w-full max-w-3xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
