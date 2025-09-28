import { useAuthStore } from '@/stores/authStore'
import { clearToken } from '@/lib/sso'

type HttpInput = RequestInfo | URL

interface HttpOptions extends RequestInit {
  // 跳过自动附带 Authorization 头
  skipAuth?: boolean
}

const getApiBaseUrl = (): URL | null => {
  // 运行时覆盖，便于无需重启本地服务即可切换 API Base
  const runtimeBase = (window as any)?.__MEMECHO_API_BASE_URL as string | undefined
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined
  const base = runtimeBase || envBase
  if (!base) return null
  try {
    return new URL(base)
  } catch {
    return null
  }
}

const getAllowedHosts = (): string[] => {
  const raw = (import.meta.env.VITE_AUTH_BEARER_HOSTS as string | undefined) ?? 'self'
  const list: string[] = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const apiBase = getApiBaseUrl()
  if (apiBase) {
    list.push(apiBase.host)
    list.push(apiBase.origin)
  }

  // 去重
  return Array.from(new Set(list))
}

const isAllowedHost = (url: URL, allowed: string[]): boolean => {
  const requestHost = url.host.toLowerCase()
  const requestOrigin = url.origin.toLowerCase()
  const selfOrigin = window.location.origin.toLowerCase()

  for (const pattern of allowed) {
    const p = pattern.toLowerCase()

    if (p === 'self') {
      if (requestOrigin === selfOrigin) return true
      continue
    }

    // 支持以 http/https 开头的完整 origin
    if (p.startsWith('http://') || p.startsWith('https://')) {
      try {
        const parsed = new URL(p)
        if (parsed.host.toLowerCase() === requestHost) return true
        continue
      } catch {
        // ignore parse error, fallback to host compare below
      }
    }

    // 支持主机名（含端口），以及通配 *.example.com
    if (p.startsWith('*.')) {
      const suffix = p.slice(1) // .example.com
      if (requestHost.endsWith(suffix)) return true
    } else {
      if (requestHost === p) return true
    }
  }

  return false
}

const resolveUrl = (input: HttpInput): URL => {
  const apiBase = getApiBaseUrl()

  const toUrl = (raw: string): URL => {
    // 如果配置了 API Base，并且是以 /api 或 api/ 开头的路径，则使用 Base 拼接
    if (apiBase) {
      if (raw.startsWith('/api')) return new URL(raw, apiBase)
      if (raw.startsWith('api/')) return new URL(`/${raw}`, apiBase)
    }
    // 否则按页面 origin 解析
    return new URL(raw, window.location.origin)
  }

  if (typeof input === 'string') return toUrl(input)
  if (input instanceof URL) return input

  const req = input as Request
  return toUrl(req.url)
}

export async function httpFetch(input: HttpInput, init?: HttpOptions): Promise<Response> {
  const url = resolveUrl(input)
  const allowedHosts = getAllowedHosts()
  const shouldAttachAuth = !init?.skipAuth && isAllowedHost(url, allowedHosts)
  const isCrossOrigin = url.origin !== window.location.origin

  // 合并 headers
  const headers = new Headers(
    init?.headers || (input instanceof Request ? (input as Request).headers : undefined)
  )

  if (shouldAttachAuth && !headers.has('Authorization')) {
    const { token } = useAuthStore.getState()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const nextInit: RequestInit = { ...init, headers }
  // 跨域时显式启用 CORS 模式，避免浏览器阻止
  if (isCrossOrigin && !nextInit.mode) {
    nextInit.mode = 'cors'
  }

  // 避免传入 Request 对象带来的不可变 headers 问题，这里统一传入 URL 字符串
  const finalInput = url.toString()

  // 捕获可能在 fetch 阶段抛出的错误（例如 CORS/网络错误），以便做 token 过期兜底判断
  let response: Response
  try {
    response = await fetch(finalInput, nextInit)
  } catch (err) {
    // 如果 token 已过期，执行退出与跳转
    try {
      const { token } = useAuthStore.getState()
      if (token) {
        const parts = token.split('.')
        if (parts.length >= 2) {
          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
          const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
          try {
            const jsonPayload = decodeURIComponent(
              atob(padded)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            )
            const claims = JSON.parse(jsonPayload) as { exp?: number }
            if (claims && typeof claims.exp === 'number') {
              const nowSec = Math.floor(Date.now() / 1000)
              if (nowSec >= claims.exp) {
                try { useAuthStore.getState().logout() } catch {}
                try { window.location.replace('/login') } catch {}
              }
            }
          } catch {
            // ignore decode error
          }
        }
      }
    } catch {
      // ignore
    }
    throw err
  }

  // 401 处理：清除token并跳转到登出页面
  if (response.status === 401) { 
    try {
      // 清除本地token
      clearToken()
      
      // 跳转到登出页面
      window.location.href = '/logout'
    } catch {
      // 如果跳转失败，至少清除token
      clearToken()
    }
  }

  return response
}

export default httpFetch


