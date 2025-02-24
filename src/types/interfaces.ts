export interface UserContextType {
  token: string | null
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
  name: string
  description: string
  price: number
  image_url: string
  quantity: number
}

export interface SaleResponse {
  hasError: boolean
  message?: string
  data?: any
}

export interface CardTcgProps {
  id: string;
  image_url: string;
  name: string;
  description: string;
  price: string;
  link?: string;
}

export interface ProductSectionProps {
  title?: string;
  products: {
    id: string;
    image_url: string;
    description: string;
    name: string;
    price: string;
    link?: string;
  }[];
  showMore?: boolean;
}