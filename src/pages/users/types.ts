export type UserRole = 'admin' | 'user' | 'owner'

export type User = {
  fullname: string
  email: string
  username: string
  role: UserRole
  avatar: string
  projects: number
  notes: string
}
