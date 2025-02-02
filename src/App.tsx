import { RoutesApp } from './routes/RoutesApp'
import { CartProvider } from './context/CartProvider'
import { UserProvider } from './context/UserProvider'

function TcgMarketApp() {

  return (
    <UserProvider>
      <CartProvider>
        <main className='flex-grow'>
          <RoutesApp />
        </main>
      </CartProvider>
    </UserProvider>
  )
}

export default TcgMarketApp
