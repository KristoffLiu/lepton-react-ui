/**
 * 域名工具函数
 * 根据环境变量获取正确的域名
 */

// 获取用户中心域名
export function getUserCenterDomain(): string {
  return import.meta.env.VITE_USER_CENTER_DOMAIN || 'https://user.memecho.com'
}

// 获取 ArtificSocius 官网域名
export function getArtificSociusDomain(): string {
  return import.meta.env.VITE_ARTIFIC_SOCIUS_DOMAIN || 'https://artific-socius.com'
}

// 获取 MemEcho 官网域名
export function getMemEchoDomain(): string {
  return import.meta.env.VITE_MEMECHO_DOMAIN || 'https://memecho.com'
}

// 获取 MemEcho Dashboard 域名
export function getMemEchoDashboardDomain(): string {
  return import.meta.env.VITE_MEMECHO_DASHBOARD_DOMAIN || 'https://dashboard.memecho.com'
}

// 获取 MemEcho 文档域名
export function getMemEchoDocsDomain(): string {
  return import.meta.env.VITE_MEMECHO_DOCS_DOMAIN || 'https://docs.memecho.com'
}
