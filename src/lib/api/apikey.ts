import httpFetch from '@/lib/http'

export type ForeverString = 'Forever'

export interface APIKeyItem {
  key_id: string
  key_name: string
  create_at: string
  update_at: string
  valid_date: string | ForeverString
}

export interface NewAPIKeyBody {
  key_name: string
  valid_date: string | ForeverString
}

export interface NewAPIKeyResult extends APIKeyItem {
  key: string
}

export interface RenewAPIKeyResult extends APIKeyItem {
  key: string
}

export async function listApiKeys(): Promise<APIKeyItem[]> {
  const res = await httpFetch('/api/v1/api-key/query/list', { method: 'POST' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`list api keys failed: ${res.status} ${text}`)
  }
  const json = await res.json().catch(() => null)
  if (!json) return []
  if (Array.isArray(json)) return json
  if (Array.isArray(json.data)) return json.data
  if (Array.isArray(json.items)) return json.items
  return []
}

export async function addApiKey(body: NewAPIKeyBody): Promise<NewAPIKeyResult> {
  const res = await httpFetch('/api/v1/api-key/add/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`add api key failed: ${res.status} ${text}`)
  }
  const json = await res.json().catch(() => null)
  if (!json) throw new Error('empty response')
  if (json.data) return json.data as NewAPIKeyResult
  return json as NewAPIKeyResult
}

export async function renewApiKey(keyId: string): Promise<RenewAPIKeyResult> {
  const url = `/api/v1/api-key/update/renew?key_id=${encodeURIComponent(keyId)}`
  const res = await httpFetch(url, { method: 'POST' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`renew api key failed: ${res.status} ${text}`)
  }
  const json = await res.json().catch(() => null)
  if (!json) throw new Error('empty response')
  if (json.data) return json.data as RenewAPIKeyResult
  return json as RenewAPIKeyResult
}

export async function revokeApiKey(keyId: string): Promise<'ok' | 'fail'> {
  const url = `/api/v1/api-key/delete/revoke?key_id=${encodeURIComponent(keyId)}`
  const res = await httpFetch(url, { method: 'POST' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`revoke api key failed: ${res.status} ${text}`)
  }
  const json = await res.json().catch(() => null)
  if (!json) return 'fail'
  if (json.data && (json.data.result === 'ok' || json.data.result === 'fail')) return json.data.result
  if (json.result === 'ok' || json.result === 'fail') return json.result
  return 'fail'
}



