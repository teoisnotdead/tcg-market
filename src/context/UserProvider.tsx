import { createContext, useReducer, useContext, useEffect, ReactNode, useCallback, useMemo, useRef } from "react";
import { UserContextType, AuthResponse, SaleData, SaleResponse, UserStats } from "../types/interfaces";
import { ApiService } from "../services/api";
import { useUserStats, useActiveSales, useAllSales, useAllPurchases, useCreateSale } from "../hooks/useQueries";

// Definición del estado
interface UserState {
  token: string | null;
  email: string | null;
  name: string | null;
  userId: string | null;
  userStats: UserStats | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

// Acciones
type UserAction =
  | { type: 'SET_USER_DATA'; payload: AuthResponse }
  | { type: 'CLEAR_USER_DATA' }
  | { type: 'SET_USER_STATS'; payload: UserStats | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { hasError: boolean; message?: string } };

// Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        token: action.payload.token,
        email: action.payload.email,
        name: action.payload.name,
        userId: action.payload.userId,
        hasError: false,
        errorMessage: null,
      };
    case 'CLEAR_USER_DATA':
      return {
        ...state,
        token: null,
        email: null,
        name: null,
        userId: null,
        userStats: null,
        hasError: false,
        errorMessage: null,
      };
    case 'SET_USER_STATS':
      return {
        ...state,
        userStats: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        hasError: action.payload.hasError,
        errorMessage: action.payload.message || null,
      };
    default:
      return state;
  }
};

// Estado inicial
const initialState: UserState = {
  token: null,
  email: null,
  name: null,
  userId: null,
  userStats: null,
  isLoading: false,
  hasError: false,
  errorMessage: null,
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const hasLoadedFromStorage = useRef(false); // Flag para evitar múltiples llamadas

  // React Query hooks
  const createSaleMutation = useCreateSale();

  // Guardar datos en localStorage
  const saveToLocalStorage = useCallback((data: AuthResponse) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("name", data.name);
    localStorage.setItem("userId", data.userId);
  }, []);

  // Eliminar datos del localStorage
  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
  }, []);

  // Cargar datos del localStorage al iniciar (solo una vez)
  useEffect(() => {
    if (hasLoadedFromStorage.current) return;
    hasLoadedFromStorage.current = true;
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("name");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedEmail && storedName) {
      dispatch({
        type: 'SET_USER_DATA',
        payload: {
          token: storedToken,
          email: storedEmail,
          name: storedName,
          userId: storedUserId || '',
        },
      });
      // Cargar stats solo si hay token válido
      ApiService.getUserStats(storedToken)
        .then(stats => {
          dispatch({ type: 'SET_USER_STATS', payload: stats });
        })
        .catch(() => {
          dispatch({ type: 'SET_USER_STATS', payload: null });
        });
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await ApiService.login(email, password);
      if (!result.token) throw new Error('No token');
      saveToLocalStorage(result);
      dispatch({ type: 'SET_USER_DATA', payload: result });
      const stats = await ApiService.getUserStats(result.token);
      dispatch({ type: 'SET_USER_STATS', payload: stats });
    } catch (error) {
      clearLocalStorage();
      dispatch({ type: 'CLEAR_USER_DATA' });
      dispatch({
        type: 'SET_ERROR',
        payload: { hasError: true, message: 'Error al iniciar sesión' },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [saveToLocalStorage, clearLocalStorage]);

  // Register
  const register = useCallback(async (email: string, name: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await ApiService.register(email, name, password);
      if (!result.token) throw new Error('No token');
      saveToLocalStorage(result);
      dispatch({ type: 'SET_USER_DATA', payload: result });
      const stats = await ApiService.getUserStats(result.token);
      dispatch({ type: 'SET_USER_STATS', payload: stats });
    } catch (error) {
      clearLocalStorage();
      dispatch({ type: 'CLEAR_USER_DATA' });
      dispatch({
        type: 'SET_ERROR',
        payload: { hasError: true, message: 'Error al registrar usuario' },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [saveToLocalStorage, clearLocalStorage]);

  // Logout
  const logout = useCallback(() => {
    clearLocalStorage();
    dispatch({ type: 'CLEAR_USER_DATA' });
    window.location.href = "/login";
  }, [clearLocalStorage]);

  // Get User Data
  const getUserData = useCallback(async (): Promise<void> => {
    if (!state.token) return;
    try {
      const data = await ApiService.getUserData(state.token);
      dispatch({
        type: 'SET_USER_DATA',
        payload: {
          token: state.token,
          email: data.email,
          name: data.name,
          userId: data.id,
        },
      });
      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: { hasError: true, message: 'Error al obtener datos del usuario' },
      });
    }
  }, [state.token]);

  // Create Sale
  const createSale = useCallback(async (saleData: SaleData): Promise<SaleResponse> => {
    if (!state.token) {
      return { hasError: true, message: "Usuario no autenticado" };
    }

    try {
      const result = await createSaleMutation.mutateAsync({ token: state.token, saleData });
      return result;
    } catch (error) {
      return { hasError: true, message: "Error al crear la venta" };
    }
  }, [state.token, createSaleMutation]);

  // Get Active Sales
  const getActiveSales = useCallback(async (limit: number, offset: number): Promise<SaleResponse> => {
    if (!state.token) {
      return { hasError: true, message: "Usuario no autenticado" };
    }

    try {
      const result = await useActiveSales(state.token, limit, offset);
      return result.data || { hasError: true, message: "No se encontraron ventas activas" };
    } catch (error) {
      return { hasError: true, message: "Error al obtener ventas activas" };
    }
  }, [state.token]);

  // Get All Sales
  const getAllSales = useCallback(async (): Promise<SaleResponse> => {
    if (!state.token) {
      return { hasError: true, message: "Usuario no autenticado" };
    }

    try {
      const result = await useAllSales(state.token);
      return result.data || { hasError: true, message: "No se encontraron ventas" };
    } catch (error) {
      return { hasError: true, message: "Error al obtener todas las ventas" };
    }
  }, [state.token]);

  // Get All Purchases
  const getAllPurchases = useCallback(async (): Promise<SaleResponse> => {
    if (!state.token) {
      return { hasError: true, message: "Usuario no autenticado" };
    }

    try {
      const result = await useAllPurchases(state.token);
      return result.data || { hasError: true, message: "No se encontraron compras" };
    } catch (error) {
      return { hasError: true, message: "Error al obtener compras" };
    }
  }, [state.token]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    getUserData,
    getUserStats: async () => {
      if (state.token) {
        const stats = await ApiService.getUserStats(state.token);
        dispatch({ type: 'SET_USER_STATS', payload: stats });
      }
    },
    createSale,
    getActiveSales,
    getAllSales,
    getAllPurchases,
  }), [
    state,
    login,
    register,
    logout,
    getUserData,
    createSale,
    getActiveSales,
    getAllSales,
    getAllPurchases,
  ]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};
