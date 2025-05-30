import { Routes, Route, useLocation } from 'react-router-dom'
import { ProfileLayout } from '../layouts/ProfileLayout'
import { Home } from '../pages/Home'
import { Register } from '../pages/Register'
import { Login } from '../pages/Login'
import { Cart } from '../pages/Cart'
import { Profile } from '../pages/Profile'
import { Marketplace } from '../pages/Marketplace'
import { useUser } from '../context/UserProvider'
import { AuthGuard } from '../guard/AuthGuard'
import { FooterSection } from '../components/FooterSection'
import { NotFound } from '../pages/NotFound'
import { NewSale } from '../pages/NewSale'
import { ActiveSales } from '../pages/ActiveSales'
import { SalesHistory } from '../pages/SalesHistory'
import { PurchasesHistory } from '../pages/PurchasesHistory'
import { SaleDetail } from '../pages/SaleDetail'
import { Favorites } from '../pages/Favorites'

export const RoutesApp: React.FC = () => {
  const { token } = useUser()
  const location = useLocation()

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
              <AuthGuard hasToken={!!token} redirect='/login'>
                <ProfileLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Profile />} />
            <Route path='nueva-venta' element={<NewSale />} />
            <Route path='mis-ventas' element={<ActiveSales />} />
            <Route path='historial-ventas' element={<SalesHistory />} />
            <Route path='mis-compras' element={<PurchasesHistory />} />
            <Route path='favoritos' element={<Favorites />} />
          </Route>

          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/card/:id' element={<SaleDetail />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>

      {!location.pathname.startsWith('/cuenta') && <FooterSection />}
    </div>
  )
} 