/**
 * 语言检测工具函数
 * 检测用户浏览器语言偏好并返回支持的语言代码
 */

// 支持的语言列表
export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh';

/**
 * 检测用户浏览器语言偏好
 * @returns 支持的语言代码
 */
export const detectUserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  // 从URL路径中检测语言
  const pathLanguage = detectLanguageFromPath();
  if (pathLanguage) {
    return pathLanguage;
  }

  // 从浏览器语言设置中检测
  const browserLanguage = detectLanguageFromBrowser();
  if (browserLanguage) {
    return browserLanguage;
  }

  // 从localStorage中获取用户之前选择的语言
  const storedLanguage = detectLanguageFromStorage();
  if (storedLanguage) {
    return storedLanguage;
  }

  return DEFAULT_LANGUAGE;
};

/**
 * 从URL路径中检测语言
 */
const detectLanguageFromPath = (): SupportedLanguage | null => {
  const path = window.location.pathname;
  const pathSegments = path.split('/').filter(Boolean);
  
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];
    if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
      return firstSegment as SupportedLanguage;
    }
  }
  
  return null;
};

/**
 * 从浏览器语言设置中检测语言
 */
const detectLanguageFromBrowser = (): SupportedLanguage | null => {
  const browserLanguages = navigator.languages || [navigator.language];
  
  for (const lang of browserLanguages) {
    // 检查完整语言代码 (如 zh-CN, en-US)
    const fullLang = lang.toLowerCase();
    if (fullLang.startsWith('zh')) return 'zh';
    if (fullLang.startsWith('en')) return 'en';
    
    // 检查简短语言代码 (如 zh, en)
    const shortLang = lang.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(shortLang as SupportedLanguage)) {
      return shortLang as SupportedLanguage;
    }
  }
  
  return null;
};

/**
 * 从localStorage中检测用户之前选择的语言
 */
const detectLanguageFromStorage = (): SupportedLanguage | null => {
  try {
    const stored = localStorage.getItem('preferred-language');
    if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
      return stored as SupportedLanguage;
    }
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error);
  }
  
  return null;
};

/**
 * 保存用户语言偏好到localStorage
 */
export const saveLanguagePreference = (language: SupportedLanguage): void => {
  try {
    localStorage.setItem('preferred-language', language);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
};

/**
 * 检查URL是否需要添加语言前缀
 */
export const needsLanguagePrefix = (pathname: string): boolean => {
  const pathSegments = pathname.split('/').filter(Boolean);
  return pathSegments.length === 0 || !SUPPORTED_LANGUAGES.includes(pathSegments[0] as SupportedLanguage);
};

/**
 * 为URL添加语言前缀
 */
export const addLanguagePrefix = (pathname: string, language: SupportedLanguage): string => {
  // 如果路径已经是根路径或空路径，直接添加语言前缀
  if (pathname === '/' || pathname === '') {
    return `/${language}`;
  }
  
  // 如果路径已经有语言前缀，替换它
  if (needsLanguagePrefix(pathname)) {
    return `/${language}${pathname}`;
  }
  
  // 如果路径已经有正确的语言前缀，直接返回
  return pathname;
};

/**
 * 从URL中提取语言代码
 */
export const extractLanguageFromPath = (pathname: string): SupportedLanguage | null => {
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];
    if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
      return firstSegment as SupportedLanguage;
    }
  }
  return null;
};
