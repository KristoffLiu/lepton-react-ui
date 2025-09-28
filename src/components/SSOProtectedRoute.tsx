import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ensureToken } from '@/lib/sso'
import { Spinner } from '@/components/kristoff/spinner'

interface SSOProtectedRouteProps {
  children: React.ReactNode
}

/**
 * SSO保护的路由组件
 * 如果用户未认证，会自动跳转到A站进行登录
 */
export default function SSOProtectedRoute({ children }: SSOProtectedRouteProps) {
  const { isAuthenticated, token, user, initializeFromSSO, fetchUserInfo } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      // 如果当前在登出页面，不进行认证检查
      if (location.pathname === '/logout') {
        setIsChecking(false)
        return
      }

      if (!isAuthenticated || !token) {
        // 尝试确保有有效token，如果没有会自动跳转到A站
        ensureToken()
        return
      }

      // 如果已认证但没有用户信息，尝试初始化
      if (!user) {
        try {
          // 首先尝试从SSO token中初始化用户信息
          initializeFromSSO()
          
          // 如果仍然没有用户信息，必须从API获取
          if (!user) {
            await fetchUserInfo()
          }
        } catch (error) {
          console.error('Failed to initialize user info:', error)
          // 如果获取用户信息失败，不允许访问
          throw error
        }
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [isAuthenticated, token, user, location.pathname, initializeFromSSO, fetchUserInfo])

  // 如果正在检查认证状态，显示加载中
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">正在验证身份...</p>
        </div>
      </div>
    )
  }

  // 如果已认证，渲染子组件
  if (isAuthenticated) {
    return <>{children}</>
  }

  // 如果未认证，重定向到根路径（会触发SSO跳转）
  return <Navigate to="/" replace />
}
