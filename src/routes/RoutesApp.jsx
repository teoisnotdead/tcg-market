import { Routes, Route } from 'react-router-dom'
import { ProfileLayout } from '../layouts/ProfileLayout'
import { Home } from '../pages/Home'
import { Register } from '../pages/Register'
import { Login } from '../pages/Login'
import { Cart } from '../pages/Cart'
import { Profile } from '../pages/Profile'
import { Marketplace } from '../pages/Marketplace'
import { CardDetails } from '../pages/CardDetails'
import { useUser } from '../context/UserProvider'
import { AuthGuard } from '../guard/AuthGuard'
import { FooterSection } from '../components/FooterSection'
import { NotFound } from '../pages/NotFound'
import { NewSale } from '../pages/NewSale'
import { ActiveSales } from '../pages/ActiveSales'
import { SalesHistory } from '../pages/SalesHistory'

export const RoutesApp = () => {
  const { token } = useUser()

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-grow'>
        <Routes>
          <Route
            path='/registrar'
            element={
              <AuthGuard hasToken={!token} redirect='/cuenta'>
                <Register />
              </AuthGuard>
            }
          />
          <Route
            path='/login'
            element={
              <AuthGuard hasToken={!token} redirect='/cuenta'>
                <Login />
              </AuthGuard>
            }
          />
          <Route
            path='/cuenta/*'
            element={
              <AuthGuard hasToken={token} redirect='/login'>
                <ProfileLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Profile />} />
            <Route path='nueva-venta' element={<NewSale />} />
            <Route path='mis-ventas' element={<ActiveSales />} />
            <Route path='historial' element={<SalesHistory />} />
          </Route>

          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/card/:id' element={<CardDetails />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>

      {!window.location.pathname.startsWith('/cuenta') && <FooterSection />}
    </div>
  )
}
