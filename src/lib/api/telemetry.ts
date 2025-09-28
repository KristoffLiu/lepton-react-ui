import httpFetch from '@/lib/http'

export type ISO8601 = string

export interface TelemetryCommonParams {
  start?: ISO8601 | string
  end?: ISO8601 | string
  req_type?: string
  memory_ids?: string[]
}

const buildSearchParams = (params: Record<string, unknown>): string => {
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

// 1) Overview
export interface TelemetryOverviewResponse {
  window_start: ISO8601
  window_end: ISO8601
  total_requests: number
  error_count: number
  error_rate: number
  rps_avg: number
  by_type: Record<string, number>
  duration_ms: {
    min: number
    max: number
    avg: number
    p50: number
    p90: number
    p95: number
    p99: number
  }
}

export async function fetchTelemetryOverview(params: TelemetryCommonParams): Promise<TelemetryOverviewResponse> {
  const qs = buildSearchParams(params as unknown as Record<string, unknown>)
  const url = `/api/v1/telemetry/overview${qs ? `?${qs}` : ''}`
  const res = await httpFetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`telemetry overview failed: ${res.status} ${text}`)
  }
  return res.json()
}

// 2) Timeseries
export interface TelemetryTimeseriesParams extends TelemetryCommonParams {
  interval?: 'minute' | 'hour' | 'day'
}

export interface TelemetryTimeseriesPoint {
  time: ISO8601
  count: number
  avg_ms: number
  p95_ms: number
  p99_ms: number
}

export async function fetchTelemetryTimeseries(params: TelemetryTimeseriesParams): Promise<TelemetryTimeseriesPoint[]> {
  const qs = buildSearchParams(params as unknown as Record<string, unknown>)
  const url = `/api/v1/telemetry/timeseries${qs ? `?${qs}` : ''}`
  const res = await httpFetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`telemetry timeseries failed: ${res.status} ${text}`)
  }
  return res.json()
}

// 3) Distribution
export interface TelemetryDistributionParams extends TelemetryCommonParams {
  bins?: number
}

export interface TelemetryDistributionBucket {
  start_ms: number
  end_ms: number
  count: number
}

export async function fetchTelemetryDistribution(params: TelemetryDistributionParams): Promise<TelemetryDistributionBucket[]> {
  const qs = buildSearchParams(params as unknown as Record<string, unknown>)
  const url = `/api/v1/telemetry/distribution${qs ? `?${qs}` : ''}`
  const res = await httpFetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`telemetry distribution failed: ${res.status} ${text}`)
  }
  return res.json()
}

// 4) Top Slowest
export interface TelemetryTopSlowestParams extends TelemetryCommonParams {
  limit?: number
}

export interface TelemetrySlowRequestItem {
  request_id_hint: string
  user_hash: string
  type: string
  timestamp: ISO8601
  duration_ms: number
}

export async function fetchTelemetryTopSlowest(params: TelemetryTopSlowestParams): Promise<TelemetrySlowRequestItem[]> {
  const qs = buildSearchParams(params as unknown as Record<string, unknown>)
  const url = `/api/v1/telemetry/top_slowest${qs ? `?${qs}` : ''}`
  const res = await httpFetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`telemetry top_slowest failed: ${res.status} ${text}`)
  }
  return res.json()
}

// 5) Memory Groups Overview
export interface TelemetryMemoryGroupsOverviewResponse {
  window_start: ISO8601
  window_end: ISO8601
  total_groups: number
  created_in_window: number
  rate_per_hour: number
}

export async function fetchTelemetryMemoryGroupsOverview(params: TelemetryCommonParams): Promise<TelemetryMemoryGroupsOverviewResponse> {
  const qs = buildSearchParams(params as unknown as Record<string, unknown>)
  const url = `/api/v1/telemetry/memory_groups_overview${qs ? `?${qs}` : ''}`
  const res = await httpFetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`telemetry memory_groups_overview failed: ${res.status} ${text}`)
  }
  return res.json()
}

// 6) New Messages Timeseries
export interface TelemetryNewMessagesTimeseriesParams extends TelemetryCommonParams {
  interval?: 'minute' | 'hour' | 'day'
}

export interface TelemetryNewMessagesPoint {
  time: ISO8601
  count: number
}

export async function fetchTelemetryNewMessagesTimeseries(params: TelemetryNewMessagesTimeseriesParams): Promise<TelemetryNewMessagesPoint[]> {
  const qs = buildSearchParams(params as unknown as Record<string, unknown>)
  const url = `/api/v1/telemetry/new_messages_timeseries${qs ? `?${qs}` : ''}`
  const res = await httpFetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`telemetry new_messages_timeseries failed: ${res.status} ${text}`)
  }
  return res.json()
}

// 7) Activity Summary
export interface TelemetryActivitySummaryParams extends TelemetryCommonParams {
  windows: string[]
}

export interface TelemetryActivitySummaryResponse {
  windows: Array<{
    window: string
    active_users_count: number
    messages_count: number
    memory_groups_count: number
  }>
}

export async function fetchTelemetryActivitySummary(params: TelemetryActivitySummaryParams): Promise<TelemetryActivitySummaryResponse> {
  const qs = buildSearchParams(params as unknown as Record<string, unknown>)
  const url = `/api/v1/telemetry/activity_summary${qs ? `?${qs}` : ''}`
  const res = await httpFetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`telemetry activity_summary failed: ${res.status} ${text}`)
  }
  return res.json()
}


