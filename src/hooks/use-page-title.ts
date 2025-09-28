import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle as usePageTitleContext } from '@/contexts/PageTitleContext'
import { useIsMobile } from '@/hooks/use-mobile'

export function usePageTitle(titleKey: string) {
  const { t } = useTranslation('common')
  const { setPageTitle } = usePageTitleContext()
  const isMobile = useIsMobile()
  
  useEffect(() => {
    if (isMobile) {
      setPageTitle(t(titleKey))
    }
  }, [isMobile, setPageTitle, t, titleKey])
}
