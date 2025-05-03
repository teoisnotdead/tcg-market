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

  static async getAllSales(token: string, limit?: number, offset?: number): Promise<SaleResponse> {
    let url = `${BASE_URL}/sales/all-sales`;
    if (limit !== undefined && offset !== undefined) {
      url += `?limit=${limit}&offset=${offset}`;
    }
    const response = await fetch(url, {
      ...this.getHeaders(token),
    });
    return response.json();
  }

  static async getAllPurchases(token: string, limit?: number, offset?: number): Promise<SaleResponse> {
    let url = `${BASE_URL}/purchases`;
    if (limit !== undefined && offset !== undefined) {
      url += `?limit=${limit}&offset=${offset}`;
    }
    const response = await fetch(url, {
      ...this.getHeaders(token),
    });
    return response.json();
  }

  static async getSaleDetail(id: string) {
    const response = await fetch(`${BASE_URL}/sales/${id}`);
    return response.json();
  }

  static async getComments(saleId: string) {
    const response = await fetch(`${BASE_URL}/comments/${saleId}`);
    return response.json();
  }

  static async addComment(token: string, saleId: string, content: string) {
    const response = await fetch(`${BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sale_id: saleId, content }),
    });
    return response.json();
  }

  static async editSale(token: string, saleId: string, updatedData: any) {
    const response = await fetch(`${BASE_URL}/sales/${saleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    return response.json();
  }

  static async deleteSale(token: string, saleId: string) {
    const response = await fetch(`${BASE_URL}/sales/${saleId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }

  static async getLatestProducts(limit: number) {
    const response = await fetch(`${BASE_URL}/sales?limit=${limit}`);
    return response.json();
  }

  static async getMarketplaceProducts(limit: number, offset: number) {
    const response = await fetch(`${BASE_URL}/sales?limit=${limit}&offset=${offset}`);
    return response.json();
  }
} 