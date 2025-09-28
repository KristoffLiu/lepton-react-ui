import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectUserLanguage, addLanguagePrefix, needsLanguagePrefix, saveLanguagePreference } from '@/lib/language-detection';

/**
 * 语言重定向组件
 * 自动检测用户语言偏好并重定向到对应的语言路径
 */
const LanguageRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // 检查当前路径是否需要添加语言前缀
    if (needsLanguagePrefix(currentPath)) {
      // 检测用户语言偏好
      const detectedLanguage = detectUserLanguage();
      
      // 保存语言偏好
      saveLanguagePreference(detectedLanguage);
      
      // 构建新的路径
      let newPath: string;
      
      // 如果是根路径，重定向到dashboard
      if (currentPath === '/' || currentPath === '') {
        newPath = `/${detectedLanguage}/dashboard`;
      } else {
        // 其他路径添加语言前缀
        newPath = addLanguagePrefix(currentPath, detectedLanguage);
      }
      
      // 重定向到新的路径
      navigate(newPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  return null; // 这个组件不渲染任何内容
};

export default LanguageRedirect;
