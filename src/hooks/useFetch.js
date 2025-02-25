import { useCallback, useState } from 'react';

export const useFetch = (url, InitOptions = {}) => {
  const [state, setState] = useState({
    data: null,  // Permite cualquier tipo de dato
    isLoading: false,
    hasError: false,
    error: null
  });

  const setLoadingState = () => {
    setState({
      data: null,
      isLoading: true,
      hasError: false,
      error: null
    });
  };

  const getFetch = useCallback(async (url, options = InitOptions) => {
    setLoadingState();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la solicitud");
      }

      // Si la respuesta es un objeto como en el login, usamos los campos de `data`
      const validData = data.data ? data.data : data; // Si no hay `data`, usa `data` tal cual
      const totalPages = data.totalPages || 1;

      setState({
        data: validData,
        isLoading: false,
        hasError: false,
        error: null
      });

      return { data: validData, totalPages, hasError: false };
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        hasError: true,
        error: error.message
      });

      return { data: null, totalPages: 1, hasError: true };
    }
  }, [url]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
    getFetch,
  };
};
