import { useState } from 'react'
import { useCart } from '../context/CartProvider'
import { useUser } from '../context/UserProvider'
import { toLocalString } from '../utils/toLocalString'
import { NavHome } from '../components/NavHome'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { CartItem } from '../types/interfaces'
import { Link } from 'react-router-dom'
import { useCheckout } from '../hooks/useQueries'

export const Cart = () => {
  const { cart, total, clearCart, removeFromCart } = useCart()
  const { token } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const checkoutMutation = useCheckout(token)

  const handlePay = async () => {
    if (!token) {
      toast.error('Debes iniciar sesión para continuar.');
      return;
    }

    setIsProcessing(true);

    try {
      for (const item of cart) {
        const response = await checkoutMutation.mutateAsync({ sale_id: item.id, quantity: item.count });
        if (response.hasError) {
          toast.error(`Error al comprar ${item.name}`, {
            description: response.message || 'Inténtalo nuevamente.',
          });
          continue;
        }
        toast.success(`Compra exitosa: ${item.name}`, {
          description: `Se compraron ${item.count} unidades.`,
        });
      }
      clearCart();
    } catch (error) {
      toast.error('Error al procesar el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className='mx-auto max-w-7xl'>
      <NavHome />
      <Toaster />
      <div className='container mx-auto my-10 px-4'>
        <h2 className='text-2xl font-bold text-white'>Carrito de Compras</h2>

        {/* ✅ Lista de productos en el carrito */}
        <div className='grid grid-cols-1 gap-4 mt-5'>
          {cart.length > 0 ? (
            cart.map((item: CartItem) => (
              <Card key={item.id} className='bg-gray-900/70 shadow-md'>
                <CardHeader className='flex-row justify-between items-center'>
                  <div className='flex items-center gap-4'>
                    <img src={item.image_url} alt={item.name} className="w-20 h-auto rounded" />
                    <div className='flex-1'>
                      <Link to={`/card/${item.id}`}>
                        <h3 className='font-bold text-white text-lg'>
                          {item.name}
                        </h3></Link>
                      <p className='text-gray-400 text-sm'>
                        <strong>Código:</strong> {item.id}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col justify-between items-center'>
                    <span className='text-yellow-400 font-bold text-md'>
                      {toLocalString(item.price)}
                    </span>

                    <p className='text-white text-sm hover:underline'>
                      Cantidad: {item.count}
                    </p>
                    <span
                      onClick={() => removeFromCart(item.id)}
                      className="text-white cursor-pointer underline hover:text-red-400 text-xs font-semibold"
                    >
                      Eliminar
                    </span>
                  </div>

                </CardHeader>
              </Card>
            ))
          ) : (
            <h2 className='text-2xl font-bold text-white'>
              No hay productos en el carrito
            </h2>
          )}
        </div>

        {/* ✅ Total y botón de pago */}
        <div className='flex flex-col items-end mt-5 p-4'>
          <h3 className='font-bold text-white text-xl'>
            Total: {toLocalString(total)}
          </h3>
          {cart.length > 0 && (
            <Button
              onClick={handlePay}
              disabled={isProcessing}
              className='mt-4 bg-green-600 hover:bg-green-700 text-white'
            >
              {isProcessing ? 'Procesando...' : 'Pagar'}
            </Button>
          )}
        </div>

        {/* ✅ Carga mientras se procesa */}
        {isProcessing && (
          <div className='flex flex-col items-center mt-5'>
            <Skeleton className='w-48 h-10 rounded-lg' />
            <p className='text-xl text-white mt-3'>Procesando el pago...</p>
          </div>
        )}
      </div>
    </section>
  )
}
