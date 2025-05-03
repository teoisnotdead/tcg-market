import { AuthResponse, SaleData, SaleResponse, UserStats } from "../types/interfaces";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error('La variable de entorno VITE_API_URL no está definida');
}

export class ApiService {
  private static getHeaders(token: string | null) {
    return {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      ...this.getHeaders(null),
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  static async register(email: string, name: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      ...this.getHeaders(null),
      body: JSON.stringify({ email, name, password }),
    });
    return response.json();
  }

  static async getUserData(token: string) {
    const response = await fetch(`${BASE_URL}/users/me`, {
      ...this.getHeaders(token),
    });
    return response.json();
  }

  static async getUserStats(token: string): Promise<UserStats> {
    const response = await fetch(`${BASE_URL}/users/stats`, {
      ...this.getHeaders(token),
    });
    return response.json();
  }

  static async createSale(token: string, saleData: SaleData): Promise<SaleResponse> {
    const response = await fetch(`${BASE_URL}/sales`, {
      method: "POST",
      ...this.getHeaders(token),
      body: JSON.stringify(saleData),
    });
    return response.json();
  }

  static async getActiveSales(token: string, limit: number, offset: number): Promise<SaleResponse> {
    const response = await fetch(
      `${BASE_URL}/sales/active-sales?limit=${limit}&offset=${offset}`,
      {
        ...this.getHeaders(token),
      }
    );
    return response.json();
  }

  static async getAllSales(token: string): Promise<SaleResponse> {
    const response = await fetch(`${BASE_URL}/sales/all-sales`, {
      ...this.getHeaders(token),
    });
    return response.json();
  }

  static async getAllPurchases(token: string): Promise<SaleResponse> {
    const response = await fetch(`${BASE_URL}/purchases`, {
      ...this.getHeaders(token),
    });
    return response.json();
  }
} 