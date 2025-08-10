// src/types/api.ts
export type ApiUser = {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
}

export type AuthResponse = {
  access_token: string
  user: ApiUser
}
