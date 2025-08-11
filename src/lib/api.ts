// src/lib/api.ts
import axios, { AxiosHeaders } from 'axios'

// Prefer runtime-injected env (window.__ENV__), then Vite env, then default
declare global {
  interface Window { __ENV__?: Record<string, string | undefined> }
}
const runtimeApiUrl = typeof window !== 'undefined' ? window.__ENV__?.VITE_API_URL : undefined
const baseURL = runtimeApiUrl ?? import.meta.env.VITE_API_URL ?? 'http://localhost:3001/v1/'

export const api = axios.create({ baseURL })

// Lazy getter to avoid circular imports
let tokenGetter: (() => string | null) | null = null
export function setAuthTokenGetter(getter: () => string | null) {
  tokenGetter = getter
}

api.interceptors.request.use((config) => {
  const token = tokenGetter?.() ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('auth:token') : null)
  if (token) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }
  return config
})

export type ApiError = {
  message?: string
  status?: number
}

export function getApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const data = err.response?.data as { message?: string } | undefined
    const message = data?.message ?? err.message
    return { status, message }
  }
  return { message: 'Unknown error' }
}
