import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { RoutesApp } from './routes/RoutesApp'
import { CartProvider } from './context/CartProvider.tsx'
import { UserProvider } from './context/UserProvider.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter } from 'react-router-dom';

function TcgMarketApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <UserProvider>
            <CartProvider>
              <main className='flex-grow'>
                <RoutesApp />
              </main>
            </CartProvider>
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default TcgMarketApp
