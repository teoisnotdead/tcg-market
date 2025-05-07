import { createContext, useReducer, useContext, useEffect, ReactNode, useCallback, useMemo, useRef } from "react";
import { UserContextType, AuthResponse, SaleData, SaleResponse, UserStats } from "../types/interfaces";
import { ApiService } from "../services/api";
import { useActiveSales, useAllSales, useAllPurchases, useCreateSale, useLogin, useRegister, useLogout, useRefreshToken } from "../hooks/useQueries";

// Definición del estado
interface UserState {
  token: string | null;
  refreshToken: string | null;
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
        token: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        email: action.payload.user.email,
        name: action.payload.user.name,
        userId: action.payload.user.id,
        hasError: false,
        errorMessage: null,
      };
    case 'CLEAR_USER_DATA':
      return {
        ...state,
        token: null,
        refreshToken: null,
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
  refreshToken: null,
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
  const hasLoadedFromStorage = useRef(false);

  // React Query hooks
  const createSaleMutation = useCreateSale();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const refreshTokenMutation = useRefreshToken();

  // Eliminar datos del localStorage
  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
  }, []);

  // Guardar datos en localStorage
  const saveToLocalStorage = useCallback((data: AuthResponse) => {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("name", data.user.name);
    localStorage.setItem("userId", data.user.id);
  }, []);

  // Verificar la validez del token periódicamente y refrescar si es necesario
  useEffect(() => {
    if (!state.token || !state.refreshToken) return;

    const checkTokenValidity = async () => {
      try {
        if (!state.token) return;
        await ApiService.getUserData(state.token);
      } catch (error) {
        if (!state.refreshToken) return;
        try {
          const newTokens = await refreshTokenMutation.mutateAsync(state.refreshToken);
          if (newTokens.accessToken && newTokens.refreshToken) {
            localStorage.setItem("token", newTokens.accessToken);
            localStorage.setItem("refreshToken", newTokens.refreshToken);
            const authData: AuthResponse = {
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
              user: {
                id: state.userId || '',
                email: state.email || '',
                name: state.name || ''
              }
            };
            dispatch({ type: 'SET_USER_DATA', payload: authData });
          } else {
            throw new Error('No se pudieron renovar los tokens');
          }
        } catch (refreshError) {
          clearLocalStorage();
          dispatch({ type: 'CLEAR_USER_DATA' });
          window.location.href = "/login";
        }
      }
    };

    // Verificar cada 5 minutos
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.token, state.refreshToken, refreshTokenMutation, state.userId, state.email, state.name, clearLocalStorage]);

  // Get User Data
  const getUserData = useCallback(async (): Promise<void> => {
    if (!state.token) return;
    try {
      const data = await ApiService.getUserData(state.token);
      const authData: AuthResponse = {
        accessToken: state.token,
        refreshToken: state.refreshToken || '',
        user: {
          id: data.id,
          email: data.email,
          name: data.name
        }
      };
      dispatch({ type: 'SET_USER_DATA', payload: authData });
      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: { hasError: true, message: 'Error al obtener datos del usuario' },
      });
    }
  }, [state.token, state.refreshToken]);

  // Cargar datos del localStorage al iniciar (solo una vez)
  useEffect(() => {
    if (hasLoadedFromStorage.current) return;
    hasLoadedFromStorage.current = true;
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("name");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedEmail && storedName && storedRefreshToken && storedUserId) {
      const authData: AuthResponse = {
        accessToken: storedToken,
        refreshToken: storedRefreshToken,
        user: {
          id: storedUserId,
          email: storedEmail,
          name: storedName
        }
      };
      dispatch({ type: 'SET_USER_DATA', payload: authData });
      
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
      const result = await loginMutation.mutateAsync({ email, password });
      if (!result.accessToken || !result.refreshToken) throw new Error('No tokens');
      saveToLocalStorage(result);
      dispatch({ type: 'SET_USER_DATA', payload: result });
      const stats = await ApiService.getUserStats(result.accessToken);
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
  }, [loginMutation, saveToLocalStorage, clearLocalStorage]);

  // Register
  const register = useCallback(async (email: string, name: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await registerMutation.mutateAsync({ email, name, password });
      if (!result.accessToken || !result.refreshToken || !result.user) throw new Error('No tokens or user data');
      saveToLocalStorage(result);
      dispatch({ type: 'SET_USER_DATA', payload: result });
      const stats = await ApiService.getUserStats(result.accessToken);
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
  }, [registerMutation, saveToLocalStorage, clearLocalStorage]);

  // Logout
  const logout = useCallback(async () => {
    if (state.token) {
      try {
        await logoutMutation.mutateAsync(state.token);
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    clearLocalStorage();
    dispatch({ type: 'CLEAR_USER_DATA' });
    window.location.href = "/login";
  }, [logoutMutation, clearLocalStorage, state.token]);

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
      const result = await useAllSales(state.token, 10, 0);
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
      const result = await useAllPurchases(state.token, 10, 0);
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
