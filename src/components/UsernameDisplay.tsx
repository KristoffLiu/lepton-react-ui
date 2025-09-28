import { Badge } from '@/components/shadcn/badge'
import { User } from 'lucide-react'
import { useState, useEffect } from 'react'

interface UsernameDisplayProps {
  showIcon?: boolean
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  className?: string
}

// 定义localStorage中user_info的类型
interface LocalUserInfo {
  id: string
  email: string
  name: string
  username?: string
  avatar?: string
  plan: string
}

export default function UsernameDisplay({ 
  showIcon = true, 
  variant = 'default',
  className = ''
}: UsernameDisplayProps) {
  const [username, setUsername] = useState<string | undefined>(undefined)

  useEffect(() => {
    // 从localStorage读取用户信息
    const loadUsername = () => {
      try {
        const userInfoStr = localStorage.getItem('user_info')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr) as LocalUserInfo
          setUsername(userInfo.username)
        }
      } catch (error) {
        console.error('解析localStorage中的user_info失败:', error)
      }
    }

    loadUsername()

    // 监听localStorage变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_info') {
        loadUsername()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // 监听自定义事件（同页面内的localStorage变化）
    const handleCustomStorageChange = () => {
      loadUsername()
    }

    window.addEventListener('userInfoUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userInfoUpdated', handleCustomStorageChange)
    }
  }, [])

  if (!username) {
    return null
  }

  return (
    <Badge variant={variant} className={`flex items-center gap-1 ${className}`}>
      {showIcon && <User className="h-3 w-3" />}
      {username}
    </Badge>
  )
}

// 使用示例组件
export function UserInfoCard() {
  const [userInfo, setUserInfo] = useState<LocalUserInfo | null>(null)

  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const userInfoStr = localStorage.getItem('user_info')
        if (userInfoStr) {
          const info = JSON.parse(userInfoStr) as LocalUserInfo
          setUserInfo(info)
        }
      } catch (error) {
        console.error('解析localStorage中的user_info失败:', error)
      }
    }

    loadUserInfo()

    // 监听localStorage变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_info') {
        loadUserInfo()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userInfoUpdated', loadUserInfo)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userInfoUpdated', loadUserInfo)
    }
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">用户名:</span>
        <UsernameDisplay />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">显示名称:</span>
        <span className="text-sm text-muted-foreground">{userInfo?.name || 'N/A'}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">邮箱:</span>
        <span className="text-sm text-muted-foreground">{userInfo?.email || 'N/A'}</span>
      </div>
    </div>
  )
}
