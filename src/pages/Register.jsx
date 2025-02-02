import { useState } from 'react'
import { useUser } from '../context/UserProvider'
import { RegisterForm } from '../components/register-form'

export const Register = () => {
  const { register, isLoading, hasError } = useUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)

  const [isDataValid, setIsDataValid] = useState(false)

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    let isValid = true

    if (!validateEmail(email)) {
      setEmailError(true)
      isValid = false
    } else {
      setEmailError(false)
    }

    if (!validatePassword(password)) {
      setPasswordError(true)
      isValid = false
    } else {
      setPasswordError(false)
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      setConfirmPasswordError(true)
      isValid = false
    } else {
      setConfirmPasswordError(false)
    }

    if (isValid) {
      await register(email, password)
      setIsDataValid(true)
    }
  }

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <RegisterForm />
      </div>
    </div>
  )
}
