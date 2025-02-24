import { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { useFetch } from "../hooks/useFetch"
import { useNavigate } from "react-router-dom"
import { UserContextType, AuthResponse, SaleData, SaleResponse, UserStats } from "../types/interfaces"

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const { isLoading, hasError, getFetch } = useFetch()
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const navigate = useNavigate()


  const getUserStats = async (): Promise<void> => {
    if (!token) return;
  
    const url = `${baseUrl}/users/stats`;
    const headers = { headers: { Authorization: `Bearer ${token}` } };
  
    const { data, hasError } = await getFetch(url, headers);
  
    if (!hasError && data) {
      setUserStats(data);
    }
  };
  
  
  useEffect(() => {
    if (token) {
      getUserStats();
    }
  }, [token]);

  const baseUrl = "http://localhost:3000"

  // Cargar datos de localStorage cuando se inicia la app
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedEmail = localStorage.getItem("email")
    const storedName = localStorage.getItem("name")

    if (storedToken) {
      setToken(storedToken)
      setEmail(storedEmail)
      setName(storedName)
    }
  }, [])

  // Función auxiliar para peticiones de autenticación (login/register)
  const authRequest = async (url: string, body: object): Promise<AuthResponse | null> => {
    const headers = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }

    const result = await getFetch(url, headers)
    return !result.hasError && result.data ? result.data : null
  }  

  // Guardar datos en localStorage y en el estado
  const setDataFromResponse = ({ email, name, token }: AuthResponse) => {
    localStorage.setItem("token", token)
    localStorage.setItem("email", email)
    localStorage.setItem("name", name)
    setToken(token)
    setEmail(email)
    setName(name)
  }

  // Eliminar datos del almacenamiento local
  const deleteDataFromLocalStorage = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    localStorage.removeItem("name")
  }

  // Iniciar sesión
  const login = async (email: string, password: string): Promise<void> => {
    const url = `${baseUrl}/auth/login`
    const result = await authRequest(url, { email, password })

    if (result) {
      setDataFromResponse(result)
    }
  }

  // Registrar usuario
  const register = async (email: string, name: string, password: string): Promise<void> => {
    const url = `${baseUrl}/auth/register`
    const result = await authRequest(url, { email, name, password })

    if (result) {
      setDataFromResponse(result)
    }
  }

  // Cerrar sesión
  const logout = () => {
    deleteDataFromLocalStorage()
    setToken(null)
    setEmail(null)
    setName(null)
    navigate("/login")
  }

  // Obtener datos del usuario logueado desde la API
  const getUserData = async (): Promise<void> => {
    if (!token) return

    const url = `${baseUrl}/users/me`
    const headers = {
      headers: { Authorization: `Bearer ${token}` },
    }

    const { data } = await getFetch(url, headers)

    if (data) {
      setEmail(data.email)
      setName(data.name)
      localStorage.setItem("email", data.email)
      localStorage.setItem("name", data.name)
    }
  }

  const createSale = async (saleData: SaleData): Promise<SaleResponse> => {
    if (!token) return { hasError: true, message: "Usuario no autenticado" }

    const url = `${baseUrl}/sales`
    const headers = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(saleData),
    }

    const result = await getFetch(url, headers)

    if (result.hasError) {
      return { hasError: true, message: "Error al crear la venta" }
    }

    return { hasError: false, data: result.data }
  }

  return (
    <UserContext.Provider
      value={{
        token,
        email,
        name,
        login,
        register,
        logout,
        getUserData,
        createSale,
        getUserStats,
        userStats,
        isLoading,
        hasError,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider")
  }
  return context
}
