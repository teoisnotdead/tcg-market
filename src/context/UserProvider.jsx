import { createContext, useState, useContext, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [token , setToken] = useState(null)
  const [email, setEmail] = useState(null)
  const { isLoading, hasError, getFetch } = useFetch()

  const navigate = useNavigate()
  const baseUrl = 'http://localhost:5000/api/auth'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setToken(token)
  }, [])
 
  const authRequest = async (url, body) => {
    const headers = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }

    return await getFetch(url, headers)
  }

  const setDataFromResponse = ({ email, token }) => {
    localStorage.setItem('token', token)
    setToken(token)
    setEmail(email)
  }

  const login = async (email, password) => {
    const url = `${baseUrl}/login`
    const result = await authRequest(url, { email, password })

    if (!result.hasError && result.data) setDataFromResponse({ email, token: result.data.token })
  }

  const register = async (email, password) => {
    const url = `${baseUrl}/registrar`
    const result = await authRequest(url, { email, password })

    if (!result.hasError && result.data) setDataFromResponse({ email, token: result.data.token })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setEmail(null)
    navigate('/login')
  }

  const getUserData = async () => {
    const url = `${baseUrl}/me`
    const headers = {
      headers: { 'Authorization': `Bearer ${token}` }
    }

    const { data } = await getFetch(url, headers)

    if (data) setEmail(data.email)
  }

  return (
    <UserContext.Provider
      value={{ token, email, login, register, logout, getUserData, isLoading, hasError }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
