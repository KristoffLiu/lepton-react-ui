import { useAuthStore } from '@/stores/authStore'

// A站（用户中心）的SSO发放端点URL
const SSO_ISSUE_URL = import.meta.env.VITE_SSO_ISSUE_URL || 'https://user-center.example.com/sso/issue'

/**
 * 验证token是否为access token
 * @param payload JWT payload对象
 * @returns 是否为有效的access token
 */
function validateAccessToken(payload: any): boolean {
  console.log('=== 验证Access Token ===')
  
  // 检查token_type字段
  if (payload.token_type) {
    console.log('Token类型:', payload.token_type)
    if (payload.token_type !== 'access' && payload.token_type !== 'Bearer') {
      console.warn('❌ 无效的token类型:', payload.token_type)
      return false
    }
  }
  
  // 检查scope字段
  if (payload.scope) {
    console.log('Token scope:', payload.scope)
    if (payload.scope.includes('refresh')) {
      console.warn('❌ 检测到refresh scope，可能是refresh token')
      return false
    }
  }
  
  // 检查过期时间是否合理（access token通常较短，1-15分钟）
  if (payload.exp) {
    const now = Math.floor(Date.now() / 1000)
    const exp = payload.exp
    const timeLeft = exp - now
    const hoursLeft = timeLeft / 3600
    
    console.log('Token剩余时间(小时):', hoursLeft.toFixed(2))
    
    if (timeLeft > 3600) { // 超过1小时
      console.warn('⚠️ 警告: Token有效期过长，可能不是access token')
      // 不直接返回false，因为有些系统可能使用较长的access token
    }
  }
  
  // 检查是否包含典型的access token字段
  const hasAccessTokenFields = payload.sub || payload.user_id || payload.userId || payload.aud
  if (!hasAccessTokenFields) {
    console.warn('⚠️ 警告: Token缺少典型的access token字段')
  }
  
  console.log('✅ Token验证通过，确认为access token')
  return true
}

/**
 * 从URL hash中提取access_token并保存到localStorage
 * 这是B站（当前项目）的回调处理逻辑
 */
export function saveTokenFromHash(): boolean {
  console.log('=== saveTokenFromHash 开始执行 ===')
  const hash = window.location.hash || ''
  console.log('原始hash:', hash)
  
  const match = hash.match(/access_token=([^&]+)/)
  console.log('正则匹配结果:', match)
  
  if (match) {
    const encodedToken = match[1]
    console.log('编码后的token:', encodedToken)
    
    const token = decodeURIComponent(encodedToken)
    console.log('解码后的token:', token)
    console.log('token长度:', token.length)
    console.log('token前50个字符:', token.substring(0, 50) + '...')
    
    // 尝试解析JWT token的header和payload
    try {
      const parts = token.split('.')
      console.log('JWT parts数量:', parts.length)
      
      if (parts.length >= 2) {
        // 解析header
        const headerBase64 = parts[0].replace(/-/g, '+').replace(/_/g, '/')
        const paddedHeader = headerBase64.padEnd(headerBase64.length + (4 - (headerBase64.length % 4)) % 4, '=')
        const headerJson = atob(paddedHeader)
        const header = JSON.parse(headerJson)
        console.log('JWT Header:', header)
        
        // 解析payload
        const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const paddedPayload = payloadBase64.padEnd(payloadBase64.length + (4 - (payloadBase64.length % 4)) % 4, '=')
        const payloadJson = atob(paddedPayload)
        const payload = JSON.parse(payloadJson)
        console.log('JWT Payload:', payload)
        
        // 检查是否包含username字段
        if (payload.username) {
          console.log('检测到username字段:', payload.username)
        }
        
        // 验证这是access token而不是refresh token
        const isValidAccessToken = validateAccessToken(payload)
        
        if (!isValidAccessToken) {
          console.error('❌ 验证失败: 这不是一个有效的access token')
          return false
        }
      }
    } catch (jwtError) {
      console.warn('JWT解析失败:', jwtError)
    }
    
    // 保存到localStorage
    console.log('保存token到localStorage...')
    localStorage.setItem('access_token', token)
    console.log('localStorage保存完成')
    
    // 同时更新auth store并解析用户信息（包括username）
    console.log('更新auth store并解析用户信息...')
    const { setToken, initializeFromSSO } = useAuthStore.getState()
    setToken(token)
    initializeFromSSO() // 立即解析用户信息，包括username字段
    console.log('auth store更新和用户信息解析完成')
    
    // 清理地址栏上的token
    const cleanUrl = window.location.origin + window.location.pathname + window.location.search
    console.log('清理URL，从:', window.location.href)
    console.log('清理URL，到:', cleanUrl)
    history.replaceState(null, '', cleanUrl)
    console.log('URL清理完成')
    
    console.log('✅ saveTokenFromHash 执行成功')
    return true
  }
  
  console.log('❌ saveTokenFromHash 未找到access_token')
  return false
}

/**
 * 检查是否有有效的token，如果没有则跳转到A站进行登录
 * @param returnTo 登录成功后要返回的URL，默认为当前页面
 * @returns 如果有token则返回token，否则返回null（会触发跳转）
 */
export function ensureToken(returnTo?: string): string | null {
  console.log('=== ensureToken 开始执行 ===')
  console.log('当前路径:', window.location.pathname)
  console.log('returnTo参数:', returnTo)
  
  // 如果当前在登出页面，不进行跳转
  if (window.location.pathname === '/logout') {
    console.log('当前在登出页面，跳过token检查')
    return null
  }

  const token = localStorage.getItem('access_token')
  console.log('从localStorage获取的token:', token ? '存在' : '不存在')
  
  if (token) {
    console.log('token长度:', token.length)
    console.log('token前50个字符:', token.substring(0, 50) + '...')
    
    // 验证token是否过期
    try {
      console.log('开始验证token有效性...')
      const parts = token.split('.')
      console.log('JWT parts数量:', parts.length)
      
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
        const jsonPayload = decodeURIComponent(
          atob(padded)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        const claims = JSON.parse(jsonPayload) as { exp?: number }
        console.log('JWT claims:', claims)
        
        if (claims && typeof claims.exp === 'number') {
          const nowSec = Math.floor(Date.now() / 1000)
          const expSec = claims.exp
          const timeLeft = expSec - nowSec
          
          console.log('当前时间戳:', nowSec, '(' + new Date(nowSec * 1000).toISOString() + ')')
          console.log('过期时间戳:', expSec, '(' + new Date(expSec * 1000).toISOString() + ')')
          console.log('剩余时间(秒):', timeLeft)
          console.log('是否已过期:', timeLeft <= 0)
          
          if (nowSec < expSec) {
            // token未过期
            console.log('✅ token有效，未过期')
            return token
          } else {
            console.log('❌ token已过期')
          }
        } else {
          console.log('❌ token中没有exp字段')
        }
      } else {
        console.log('❌ token格式不正确，parts数量不足')
      }
    } catch (error) {
      console.error('❌ token解析失败:', error)
    }
  } else {
    console.log('❌ localStorage中没有token')
  }
  
  // 没有有效token，跳转到A站
  console.log('准备跳转到A站进行登录...')
  const targetUrl = returnTo || window.location.href
  const encodedReturnTo = encodeURIComponent(targetUrl)
  // 使用当前域名作为回调地址
  const callbackUrl = `${window.location.origin}/sso/callback`
  const ssoUrl = `${SSO_ISSUE_URL}?return_to=${encodedReturnTo}&callback_url=${encodeURIComponent(callbackUrl)}`
  
  console.log('跳转目标URL:', targetUrl)
  console.log('编码后的return_to:', encodedReturnTo)
  console.log('回调URL:', callbackUrl)
  console.log('完整SSO URL:', ssoUrl)
  
  window.location.href = ssoUrl
  console.log('已执行跳转到A站')
  
  return null
}

/**
 * 清除本地token
 */
export function clearToken(): void {
  localStorage.removeItem('access_token')
  const { logout } = useAuthStore.getState()
  logout()
}

/**
 * 安全登出 - 先跳转到登出页面，再清除token
 */
export function safeLogout(): void {
  // 先跳转到登出页面
  window.location.href = '/logout'
}

/**
 * 初始化SSO - 在应用启动时调用
 * 1. 尝试从hash中提取token
 * 2. 如果有现有token，验证并设置到store
 * 3. 不自动跳转，让路由保护组件处理
 */
export function initializeSSO(): void {
  console.log('=== initializeSSO 开始执行 ===')
  console.log('当前URL:', window.location.href)
  console.log('当前时间:', new Date().toISOString())
  
  // 首先尝试从hash中提取token
  console.log('步骤1: 尝试从hash中提取token...')
  const hasTokenFromHash = saveTokenFromHash()
  console.log('从hash提取token结果:', hasTokenFromHash)
  
  if (hasTokenFromHash) {
    // 成功从hash中提取到token，不需要跳转
    console.log('✅ 成功从hash中提取到token，初始化完成')
    return
  }
  
  // 检查是否已有有效token
  console.log('步骤2: 检查localStorage中的现有token...')
  const existingToken = localStorage.getItem('access_token')
  console.log('localStorage中的token:', existingToken ? '存在' : '不存在')
  
  if (existingToken) {
    console.log('现有token长度:', existingToken.length)
    console.log('现有token前50个字符:', existingToken.substring(0, 50) + '...')
    
    // 验证现有token是否有效
    try {
      console.log('开始验证现有token有效性...')
      const parts = existingToken.split('.')
      console.log('JWT parts数量:', parts.length)
      
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
        const jsonPayload = decodeURIComponent(
          atob(padded)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        const claims = JSON.parse(jsonPayload) as { exp?: number }
        console.log('现有token的claims:', claims)
        
        if (claims && typeof claims.exp === 'number') {
          const nowSec = Math.floor(Date.now() / 1000)
          const expSec = claims.exp
          const timeLeft = expSec - nowSec
          
          console.log('当前时间戳:', nowSec, '(' + new Date(nowSec * 1000).toISOString() + ')')
          console.log('过期时间戳:', expSec, '(' + new Date(expSec * 1000).toISOString() + ')')
          console.log('剩余时间(秒):', timeLeft)
          console.log('是否已过期:', timeLeft <= 0)
          
          if (nowSec < expSec) {
            // token有效，更新auth store
            console.log('✅ 现有token有效，更新auth store')
            const { setToken } = useAuthStore.getState()
            setToken(existingToken)
            console.log('auth store更新完成')
            return
          } else {
            console.log('❌ 现有token已过期')
          }
        } else {
          console.log('❌ 现有token中没有exp字段')
        }
      } else {
        console.log('❌ 现有token格式不正确')
      }
    } catch (error) {
      console.error('❌ 现有token解析失败:', error)
    }
  } else {
    console.log('❌ localStorage中没有现有token')
  }
  
  // 没有有效token，但不自动跳转
  // 让SSOProtectedRoute组件处理跳转逻辑
  console.log('步骤3: 没有有效token，等待SSOProtectedRoute处理跳转')
  console.log('=== initializeSSO 执行完成 ===')
}
