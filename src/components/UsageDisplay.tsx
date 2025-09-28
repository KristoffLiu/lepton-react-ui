import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/shadcn/badge'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Database, Package, TrendingUp } from 'lucide-react'
import { getMemoryVaults } from '@/lib/api/memory'
import { getMySubscriptions, getAvailablePackages } from '@/lib/api/user'

interface UsageDisplayProps {
  className?: string
}

export function UsageDisplay({ className }: UsageDisplayProps) {
  const { t } = useTranslation('common')
  
  // 获取记忆库用量
  const { data: vaultsData, isLoading: vaultsLoading } = useQuery({
    queryKey: ['memory-vaults'],
    queryFn: getMemoryVaults,
  })

  // 获取订阅信息
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: getMySubscriptions,
  })

  // 获取可用包裹
  const { data: packagesData, isLoading: packagesLoading } = useQuery({
    queryKey: ['available-packages'],
    queryFn: getAvailablePackages,
  })

  // 计算总用量
  const totalUsage = vaultsData?.content?.vaults?.reduce((sum, vault) => sum + vault.usage, 0) || 0

  // 获取当前订阅的用量限制
  const currentSubscription = subscriptionsData?.content?.subscriptions?.[0]
  const currentPackage = packagesData?.content?.packages?.find(
    pkg => pkg.name === currentSubscription?.name
  )
  const contentLimit = currentPackage?.content?.content_limit || 0

  const isLoading = vaultsLoading || subscriptionsLoading || packagesLoading

  if (isLoading) {
    return (
      <div className={`flex items-center gap-6 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Database className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{t('usageDisplay.memoryVaults')}</div>
            <Skeleton className="h-6 w-16 mt-1" />
          </div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{t('usageDisplay.subscriptionLimit')}</div>
            <Skeleton className="h-6 w-16 mt-1" />
          </div>
        </div>
      </div>
    )
  }

  const usagePercentage = contentLimit > 0 ? (totalUsage / contentLimit) * 100 : 0
  const isNearLimit = usagePercentage > 80
  const isOverLimit = usagePercentage > 100

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {/* 记忆库用量 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
          <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{t('usageDisplay.memoryVaults')}</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{totalUsage.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">
              ({vaultsData?.content?.vaults?.length || 0} {t('usageDisplay.vaults')})
            </span>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="w-px h-8 bg-border" />

      {/* 订阅限制 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
          <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{t('usageDisplay.subscriptionLimit')}</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{contentLimit.toLocaleString()}</span>
            {currentSubscription && (
              <Badge 
                variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
                className="text-xs"
              >
                {currentSubscription.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 使用百分比 */}
      {contentLimit > 0 && (
        <>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t('usageDisplay.usageRate')}</div>
              <div className={`text-lg font-semibold ${isOverLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-muted-foreground'}`}>
                {usagePercentage.toFixed(1)}%
              </div>
              {isOverLimit && (
                <div className="text-xs text-red-600 font-medium">{t('usageDisplay.overLimit')}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
