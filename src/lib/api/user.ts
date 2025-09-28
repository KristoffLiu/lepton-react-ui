import httpFetch from '@/lib/http'

export interface UserInfo {
  id: string
  email: string
  name: string
  username?: string
  avatar?: string
  plan?: 'free' | 'pro' | 'enterprise'
  [key: string]: any
}

/**
 * 从用户中心获取当前用户信息
 */
export async function fetchUserInfo(): Promise<UserInfo> {
  const userCenterApiUrl = import.meta.env.VITE_USERCENTER_API_URL
  
  if (!userCenterApiUrl) {
    // 提供更友好的错误信息，并建议如何配置
    const errorMessage = 'VITE_USERCENTER_API_URL environment variable is not configured. Please set it in your .env file or environment variables.'
    console.warn(errorMessage)
    console.warn('Example: VITE_USERCENTER_API_URL=https://usercenter.example.com')
    throw new Error(errorMessage)
  }

  // 构建完整的API URL
  const apiUrl = `${userCenterApiUrl}/api/v1/users/me`
  
  const response = await httpFetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - please login again')
    }
    throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`)
  }

  const userInfo = await response.json()
  
  // 确保返回的数据符合UserInfo接口
  return {
    id: userInfo.id || userInfo.user_id || '',
    email: userInfo.email || '',
    name: userInfo.name || userInfo.display_name || '',
    username: userInfo.username || undefined,
    avatar: userInfo.avatar || userInfo.avatar_url || userInfo.picture || undefined,
    plan: userInfo.plan || userInfo.subscription_plan || 'free',
    ...userInfo, // 保留其他可能的字段
  }
}

// 获取订阅信息
export interface Subscription {
  start_date: string
  end_date: string
  name: string
  type: string
}

export interface SubscriptionsResponse {
  code: number
  success: boolean
  message: string
  content: {
    subscriptions: Subscription[]
  }
  page: {
    number: number
    size: number
    total_elements: number
    total_pages: number
    first: boolean
    last: boolean
  }
}

export async function getMySubscriptions(): Promise<SubscriptionsResponse> {
  const userCenterApiUrl = import.meta.env.VITE_USERCENTER_API_URL
  
  if (!userCenterApiUrl) {
    throw new Error('VITE_USERCENTER_API_URL environment variable is not configured')
  }

  const apiUrl = `${userCenterApiUrl}/api/v1/subscriptions/my-subscriptions`
  
  // 手动添加认证 token
  const { useAuthStore } = await import('@/stores/authStore')
  const { token } = useAuthStore.getState()
  
  const response = await httpFetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch subscriptions: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

// 获取可用包裹
export interface PackageContent {
  request_count_limit: number
  content_limit: number
  service_level: string
}

export interface Package {
  type: string
  name: string
  unique_id: string
  price: number
  duration: number
  content: PackageContent
  description: string
}

export interface PackagesResponse {
  code: number
  success: boolean
  message: string
  content: {
    packages: Package[]
  }
  page: {
    number: number
    size: number
    total_elements: number
    total_pages: number
    first: boolean
    last: boolean
  }
}

export async function getAvailablePackages(): Promise<PackagesResponse> {
  const userCenterApiUrl = import.meta.env.VITE_USERCENTER_API_URL
  
  if (!userCenterApiUrl) {
    throw new Error('VITE_USERCENTER_API_URL environment variable is not configured')
  }

  const apiUrl = `${userCenterApiUrl}/api/v1/packages/available`
  
  // 手动添加认证 token
  const { useAuthStore } = await import('@/stores/authStore')
  const { token } = useAuthStore.getState()
  
  const response = await httpFetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch packages: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}