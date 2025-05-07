import { AuthResponse, SaleData, SaleResponse, UserStats } from "../types/interfaces";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error('La variable de entorno VITE_API_URL no está definida');
}

// Función para manejar errores de autenticación
const handleAuthError = async (response: Response) => {
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        const newTokens = await ApiService.refreshToken(refreshToken);
        if (newTokens.accessToken) {
          localStorage.setItem("token", newTokens.accessToken);
          localStorage.setItem("refreshToken", newTokens.refreshToken);
          // Reintentar la petición original con el nuevo token
          return true;
        }
      } catch (error) {
        ApiService.clearAuthData();
        window.location.href = "/login";
        throw new Error('Sesión expirada');
      }
    } else {
      ApiService.clearAuthData();
      window.location.href = "/login";
      throw new Error('Sesión expirada');
    }
  }
  return false;
};

export class ApiService {
  private static getHeaders(token: string | null) {
    return {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
  }

  static clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      ...this.getHeaders(null),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("userId", data.user.id);
    }
    return data;
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    return response.json();
  }

  static async logout(token: string): Promise<void> {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        ...this.getHeaders(token),
      });
    } finally {
      this.clearAuthData();
    }
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
    handleAuthError(response);
    return response.json();
  }

  static async getUserStats(token: string): Promise<UserStats> {
    const response = await fetch(`${BASE_URL}/users/stats`, {
      ...this.getHeaders(token),
    });
    handleAuthError(response);
    return response.json();
  }

  static async createSale(token: string, saleData: SaleData): Promise<SaleResponse> {
    const response = await fetch(`${BASE_URL}/sales`, {
      method: "POST",
      ...this.getHeaders(token),
      body: JSON.stringify(saleData),
    });
    handleAuthError(response);
    return response.json();
  }

  static async getActiveSales(token: string, limit: number, offset: number): Promise<SaleResponse> {
    const response = await fetch(
      `${BASE_URL}/sales/active-sales?limit=${limit}&offset=${offset}`,
      {
        ...this.getHeaders(token),
      }
    );
    handleAuthError(response);
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
    handleAuthError(response);
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
    handleAuthError(response);
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
    handleAuthError(response);
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
    handleAuthError(response);
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
    handleAuthError(response);
    return response.json();
  }

  static async getLatestProducts(limit: number) {
    const response = await fetch(`${BASE_URL}/sales?limit=${limit}`);
    return response.json();
  }

  static async getMarketplaceProducts(limit: number, offset: number, categories: string[] = []) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });
    if (categories.length > 0) {
      params.append('categories', categories.join(','));
    }
    const response = await fetch(`${BASE_URL}/sales?${params.toString()}`);
    return response.json();
  }

  static async checkout(token: string, sale_id: string, quantity: number) {
    const response = await fetch(`${BASE_URL}/sales/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sale_id, quantity }),
    });
    handleAuthError(response);
    return response.json();
  }

  static async getSearchSales(q: string, limit: number, offset: number, categories: string[] = []) {
    const params = new URLSearchParams({
      search: q,
      limit: limit.toString(),
      offset: offset.toString()
    });
    if (categories.length > 0) {
      params.append('categories', categories.join(','));
    }
    const response = await fetch(`${BASE_URL}/sales/search?${params.toString()}`);
    return response.json();
  }

  static async addFavorite(token: string, saleId: string) {
    const response = await fetch(`${BASE_URL}/favorites/${saleId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    handleAuthError(response);
    return response.json();
  }

  static async removeFavorite(token: string, saleId: string) {
    const response = await fetch(`${BASE_URL}/favorites/${saleId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    handleAuthError(response);
    return response.json();
  }

  static async getUserFavorites(token: string, limit?: number, offset?: number) {
    let url = `${BASE_URL}/favorites`;
    if (limit !== undefined && offset !== undefined) {
      url += `?limit=${limit}&offset=${offset}`;
    }
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    handleAuthError(response);
    return response.json();
  }

  static async checkFavorite(token: string, saleId: string) {
    const response = await fetch(`${BASE_URL}/favorites/check/${saleId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    handleAuthError(response);
    return response.json();
  }

  static async getLanguages() {
    const response = await fetch(`${BASE_URL}/languages`);
    return response.json();
  }

  static async getCategories() {
    const response = await fetch(`${BASE_URL}/categories`);
    return response.json();
  }
} 