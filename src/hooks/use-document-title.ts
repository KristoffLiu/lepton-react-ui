import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 动态设置页面标题的Hook
 * 根据当前语言和页面路径自动设置对应的标题
 */
export function useDocumentTitle(pageTitle?: string) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // 获取基础标题
    const baseTitle = t('title');
    
    // 如果有页面特定标题，则组合显示
    const fullTitle = pageTitle 
      ? `${baseTitle} - ${pageTitle}`
      : `${baseTitle} Dashboard`;
    
    // 设置页面标题
    document.title = fullTitle;
    
    // 同时更新HTML lang属性
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language, pageTitle]);
}

/**
 * 设置页面标题的简单函数
 * 可以在组件外部使用
 */
export function setDocumentTitle(title: string) {
  document.title = title;
}

/**
 * 根据翻译键设置页面标题
 */
export function setDocumentTitleByKey(t: (key: string) => string, key: string, pageTitle?: string) {
  const baseTitle = t('title');
  const fullTitle = pageTitle 
    ? `${baseTitle} - ${pageTitle}`
    : `${baseTitle} Dashboard`;
  
  document.title = fullTitle;
}
