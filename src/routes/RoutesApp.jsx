import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Register } from '../pages/Register'
import { Login } from '../pages/Login'
import { Cart } from '../pages/Cart'
import { Profile } from '../pages/Profile'
import { useUser } from '../context/UserProvider'
import { AuthGuard } from '../guard/AuthGuard'

export const RoutesApp = () => {
  const { token } = useUser()

  return (
    <>
      <Routes>
        <Route path='/registrar' element={
          <AuthGuard hasToken={!token} redirect='/cuenta'>
            <Register />
          </AuthGuard>
        } />
        <Route path='/login' element={
          <AuthGuard hasToken={!token} redirect='/cuenta'>
            <Login />
          </AuthGuard>
        } />

        <Route path='/cuenta' element={
          <AuthGuard hasToken={token} redirect='/login'>
            <Profile />
          </AuthGuard>
        } />

        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>
    </>
  )
}
