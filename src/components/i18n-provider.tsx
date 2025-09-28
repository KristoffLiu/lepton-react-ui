import React, { useState, useEffect } from 'react';
import { waitForInit, isI18nInitialized } from '@/lib/i18n-client';
import { Spinner } from '@/components/kristoff/spinner';

interface I18nProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function I18nProvider({ children, fallback }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initI18n = async () => {
      if (isI18nInitialized()) {
        setIsReady(true);
        return;
      }

      try {
        await waitForInit();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // 即使失败也设置为ready，避免无限加载
        setIsReady(true);
      }
    };

    initI18n();
  }, []);

  if (!isReady) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
