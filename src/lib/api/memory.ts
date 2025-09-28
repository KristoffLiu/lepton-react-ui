import httpFetch from '@/lib/http'
import type { MemoryResult, MemoryCountResult, MemoryRole } from '@/types'

export async function listMemoryLibraryIds(): Promise<string[]> {
  const response = await httpFetch('/api/v1/memory-lib/query/list-memory-id', {
    method: 'POST',
  })

  // 不阻断 header 捕获用例，但抛出明确错误
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`list-memory-id failed: ${response.status} ${text}`)
  }

  const json = await response.json().catch(() => null)
  if (!json) return []
  // 新结构：{ code, message, data: { ids: [...] } }
  if (json && Array.isArray(json.ids)) {
    return json.ids.map(String)
  }
  return []
}

export interface GetMemoryQuery {
  memory_id: string
  limit?: number | null
  page?: number
  start_time_iso?: string | null
  end_time_iso?: string | null
  roles?: MemoryRole[] | null
}

const buildQueryString = (params: Record<string, unknown>) => {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((v) => usp.append(key, String(v)))
    } else {
      usp.set(key, String(value))
    }
  })
  return usp.toString()
}

export async function getMemory(query: GetMemoryQuery): Promise<MemoryResult> {
  const qs = buildQueryString(query as unknown as Record<string, unknown>)
  const url = `/api/v1/memory-lib/query/get-memory?${qs}`
  const response = await httpFetch(url, { method: 'POST' })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`get-memory failed: ${response.status} ${text}`)
  }
  const json = await response.json().catch(() => null)
  if (!json) return { messages: [] }
  if (json.data && Array.isArray(json.data.messages)) return { messages: json.data.messages }
  if (Array.isArray(json.messages)) return { messages: json.messages }
  return { messages: [] }
}

export async function countMemory(query: GetMemoryQuery): Promise<MemoryCountResult> {
  const qs = buildQueryString(query as unknown as Record<string, unknown>)
  const url = `/api/v1/memory-lib/query/count-memory?${qs}`
  const response = await httpFetch(url, { method: 'POST' })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`count-memory failed: ${response.status} ${text}`)
  }
  const json = await response.json().catch(() => null)
  if (!json) return { count: 0, total_pages: null }
  if (json.data && typeof json.data.count === 'number') {
    return { count: json.data.count, total_pages: json.data.total_pages ?? null }
  }
  if (typeof json.count === 'number') {
    return { count: json.count, total_pages: json.total_pages ?? null }
  }
  return { count: 0, total_pages: null }
}

// 删除单条或多条消息
export interface DeleteMessageItem {
  message_id: string
  memory_id: string
}

export async function deleteMemoryMessages(items: DeleteMessageItem[]): Promise<Array<'ok' | 'fail'>> {
  const response = await httpFetch('/api/v1/memory-lib/message/delete/remove/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delete_list: items }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`delete-message failed: ${response.status} ${text}`)
  }
  const json = await response.json().catch(() => null)
  if (!json) return []
  if (json.data && Array.isArray(json.data.results)) return json.data.results
  if (Array.isArray(json.results)) return json.results
  return []
}

// 删除记忆库
export async function deleteMemoryLibrary(memory_id: string): Promise<'ok' | 'fail'> {
  const url = `/api/v1/memory-lib/delete/remove/memory-lib?memory_id=${encodeURIComponent(memory_id)}`
  const response = await httpFetch(url, { method: 'POST' })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`delete-memory-lib failed: ${response.status} ${text}`)
  }
  const json = await response.json().catch(() => null)
  if (!json) return 'fail'
  if (json.data && (json.data.result === 'ok' || json.data.result === 'fail')) return json.data.result
  if (json.result === 'ok' || json.result === 'fail') return json.result
  return 'fail'
}

// 获取记忆库用量
export interface MemoryVault {
  id: number
  unique_id: string
  name: string
  usage: number
  created_at: string
  updated_at: string
}

export interface MemoryVaultsResponse {
  code: number
  success: boolean
  message: string
  content: {
    vaults: MemoryVault[]
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

export async function getMemoryVaults(): Promise<MemoryVaultsResponse> {
  const userCenterApiUrl = import.meta.env.VITE_USERCENTER_API_URL
  
  if (!userCenterApiUrl) {
    throw new Error('VITE_USERCENTER_API_URL environment variable is not configured')
  }

  const apiUrl = `${userCenterApiUrl}/api/v1/memory-vaults`
  
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
    throw new Error(`Failed to fetch memory vaults: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}


