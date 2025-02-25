import { RoutesApp } from './routes/RoutesApp.jsx'
import { CartProvider } from './context/CartProvider.tsx'
import { UserProvider } from './context/UserProvider.tsx'
import { ThemeProvider } from "@/components/theme-provider"

function TcgMarketApp() {

  return (
    <UserProvider>
      <CartProvider>
        <main className='flex-grow'>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RoutesApp />
          </ThemeProvider>
        </main>
      </CartProvider>
    </UserProvider>
  )
}

export default TcgMarketApp
