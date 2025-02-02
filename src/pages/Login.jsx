import { useState } from 'react'
import { useUser } from '../context/UserProvider'
import { LoginForm } from '@/components/login-form'

export const Login = () => {
  const { login, isLoading, hasError } = useUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setEmailError(false)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setPasswordError(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) setEmailError(true)
    if (!password) setPasswordError(true)

    await login(email, password)
  }

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  )
}
