import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu"
import { Button } from "@/components/shadcn/button"
import { changeLanguage, getCurrentLanguage } from '@/lib/i18n-client';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar"

interface LanguageSwitcherProps {
  variant?: 'default' | 'sidebar';
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocale, setCurrentLocale] = useState('zh');

  useEffect(() => {
    // 从URL获取当前语言
    const path = location.pathname;
    if (path.startsWith('/en')) {
      setCurrentLocale('en');
    } else if (path.startsWith('/zh')) {
      setCurrentLocale('zh');
    }
  }, [location.pathname]);

  const switchLanguage = async (locale: string) => {
    try {
      // 获取当前路径并移除当前语言前缀
      const currentPath = location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
      const newPath = `/${locale}${currentPath}`;
      
      // 切换i18n语言
      await changeLanguage(locale);
      setCurrentLocale(locale);
      
      // 导航到新路径
      navigate(newPath);
    } catch (error) {
      console.error('Failed to switch language:', error);
    }
  };

  if (variant === 'sidebar') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    <path d="M2 12h20"/>
                  </svg>
                </div>
                <div className="flex-1 text-left text-sm">
                  <span className="truncate">
                    {currentLocale === 'zh' ? t('sidebar.chinese') : t('sidebar.english')}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-auto size-4"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem
                onClick={() => switchLanguage('zh')}
                className={currentLocale === 'zh' ? 'bg-accent' : ''}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm font-medium">🇨🇳</span>
                  {t('sidebar.chinese')}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchLanguage('en')}
                className={currentLocale === 'en' ? 'bg-accent' : ''}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm font-medium">🇺🇸</span>
                  {t('sidebar.english')}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // 默认版本（用于顶部导航栏）
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[1.2rem] w-[1.2rem]"
          >
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            <path d="M2 12h20"/>
          </svg>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLanguage('zh')}
          className={currentLocale === 'zh' ? 'bg-accent' : ''}
        >
          {t('sidebar.chinese')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage('en')}
          className={currentLocale === 'en' ? 'bg-accent' : ''}
        >
          {t('sidebar.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 