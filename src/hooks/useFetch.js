import { useCallback, useState } from 'react'

export const useFetch = (url, InitOptions = {}) => {

  const [state, setState] = useState({
    data: null,
    isLoading: false,
    hasError: false,
    error: null
  })

  const setLoadingState = () => {
    setState({
      data: null,
      isLoading: true,
      hasError: false,
      error: null
    })
  }

  const getFetch = useCallback(async (url, options = InitOptions) => {
      setLoadingState()
  
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
  
        const response = await fetch(url, options)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error)
        }
  
        setState({
          data: data,
          isLoading: false,
          hasError: false,
          error: null
        })

        return { data, hasError: false }
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          hasError: true,
          error: error.message
        })

        return { data: null, hasError: true }
      }
    }, [url]
  )

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
    getFetch,
  }
}
