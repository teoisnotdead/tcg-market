export interface UserContextType {
  token: string | null
  userId: string | null
  email: string | null
  name: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
  getUserData: () => Promise<void>
  createSale: (saleData: SaleData) => Promise<SaleResponse>
  getUserStats: () => Promise<void>
  getActiveSales: () => Promise<SaleResponse>
  getAllSales: () => Promise<SaleResponse>
  isLoading: boolean
  hasError: boolean
  userStats: UserStats | null
}

export interface UserStats {
  sales: {
    active: number
    sold: number
    total_earned: number
  }
  purchases: {
    total_purchases: number
    total_spent: number
  }
}

export interface AuthResponse {
  email: string
  name: string
  token: string
}

export interface SaleData {
  id: string
  seller_id: string
  name: string
  description: string
  seller_name: string
  price: number
  image_url: string
  quantity: number
  status: string
}

export interface SaleResponse {
  hasError: boolean
  message?: string
  data?: any
}

export interface CardTcgProps {
  id: string
  image_url: string
  name: string
  description: string
  price: string
  link?: string
}

export interface ProductSectionProps {
  title?: string
  products: {
    id: string
    image_url: string
    description: string
    name: string
    price: string
    link?: string
  }[]
  showMore?: boolean
}

export interface Comment {
  id: string
  user_id: string
  user_name: string
  content: string
  created_at: string
}
