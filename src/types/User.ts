export interface UserPreferences {
  climate: string
  maxBudget: number
  theme: string[]
  continent: string
  vibe: string[]
}

export interface User {
  id: number
  username: string
  email: string
  password: string
  preferences: UserPreferences
  wishlist: number[]
  isAdmin: boolean
}