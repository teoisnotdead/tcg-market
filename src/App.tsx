import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { RoutesApp } from './routes/RoutesApp.jsx'
import { CartProvider } from './context/CartProvider.tsx'
import { UserProvider } from './context/UserProvider.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter } from 'react-router-dom';

function TcgMarketApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <CartProvider>
            <main className='flex-grow'>
              <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <RoutesApp />
              </ThemeProvider>
            </main>
          </CartProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default TcgMarketApp
