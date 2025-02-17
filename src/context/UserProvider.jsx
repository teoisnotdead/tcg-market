import { createContext, useState, useContext, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'

import { loginResponse, registerResponse } from '../mock/cards'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null)
  const [name, setName] = useState(null)
  const { isLoading, hasError, getFetch } = useFetch()

  const navigate = useNavigate()
  const baseUrl = 'https://tcg-market-api.onrender.com/auth'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setToken(token)
  }, [])

  const authRequest = async (url, body) => {
    const headers = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }

    return await getFetch(url, headers)
  }

  const setDataFromResponse = ({ email, name, token }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
    localStorage.setItem('name', name)
    setToken(token)
    setEmail(email)
    setName(name)
  }

  const getDataFromLocalStorage = () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const name = localStorage.getItem('name')

    return { email, token, name }
  }

  const login = async (email, password) => {
    const url = `${baseUrl}/login`
    const result = await authRequest(url, { email, password })

    if (!result.hasError && result.data)
      setDataFromResponse({ email, token: result.data.token })
  }

  const loginFromMock = async (email, password) => {
    console.log('loginFromMock')
    const data = loginResponse

    setDataFromResponse({ email, token: data.data.token })

    return data
  }

  const registerFromMock = async (email, password) => {
    console.log('registerFromMock')
    const data = registerResponse

    setDataFromResponse({ email, token: data.data.token })

    return data
  }

  const register = async (email, name, password) => {
    const url = `${baseUrl}/register`
    const result = await authRequest(url, { email, name, password })

    if (!result.hasError && result.data)
      setDataFromResponse({ email, token: result.data.token })
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
      headers: { Authorization: `Bearer ${token}` },
    }

    const { data } = await getFetch(url, headers)

    if (data) setEmail(data.email)
  }

  return (
    <UserContext.Provider
      value={{
        token,
        email,
        login,
        register,
        logout,
        getUserData,
        isLoading,
        hasError,
        loginFromMock,
        registerFromMock,
        getDataFromLocalStorage,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
