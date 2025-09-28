import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectUserLanguage, extractLanguageFromPath, type SupportedLanguage } from './language-detection';

// 初始化状态
let isInitialized = false;
let initPromise: Promise<void> | null = null;

// 从 URL 获取当前语言
const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window !== 'undefined') {
    // 首先尝试从URL路径中提取语言
    const pathLanguage = extractLanguageFromPath(window.location.pathname);
    if (pathLanguage) {
      return pathLanguage;
    }
    
    // 如果URL中没有语言信息，使用语言检测功能
    return detectUserLanguage();
  }
  return 'zh'; // 默认中文
};

// 动态加载翻译资源
const loadResources = async () => {
  try {
    const [zhCommon, enCommon] = await Promise.all([
      import('@/locales/zh/common'),
      import('@/locales/en/common'),
    ]);

    await i18next
      .use(initReactI18next)
      .init({
        lng: getInitialLanguage(),
        resources: {
          zh: {
            common: zhCommon.default,
          },
          en: {
            common: enCommon.default,
          },
        },
        defaultNS: 'common',
        fallbackLng: 'zh',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
    
    isInitialized = true;
  } catch (error) {
    console.error('Failed to load translation resources:', error);
    // 如果加载失败，使用默认配置
    await i18next
      .use(initReactI18next)
      .init({
        lng: getInitialLanguage(),
        resources: {
          zh: { common: {} },
          en: { common: {} },
        },
        defaultNS: 'common',
        fallbackLng: 'zh',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
    
    isInitialized = true;
  }
};

// 获取初始化Promise
const getInitPromise = () => {
  if (!initPromise) {
    initPromise = loadResources();
  }
  return initPromise;
};

// 等待初始化完成
export const waitForInit = async () => {
  if (isInitialized) return;
  await getInitPromise();
};

// 检查是否已初始化
export const isI18nInitialized = () => isInitialized;

// 初始化资源
getInitPromise();

// 导出语言切换函数
export const changeLanguage = async (locale: string) => {
  await waitForInit();
  await i18next.changeLanguage(locale);
};

// 导出当前语言获取函数
export const getCurrentLanguage = () => {
  if (!isInitialized) return getInitialLanguage();
  return i18next.language;
};

export default i18next; 