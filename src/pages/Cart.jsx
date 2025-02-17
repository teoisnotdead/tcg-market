import { useFetch } from '../hooks/useFetch'
import { useUser } from '../context/UserProvider'
import { useCart } from '../context/CartProvider'
import { toLocalString } from '../utils/toLocalString'
import { NavHome } from '../components/NavHome'
// import { Spinner } from '../components/Spinner'

export const Cart = () => {
  const { data, isLoading, hasError, getFetch } = useFetch()
  const { cart, total, incrementCount, decrementCount, cleanCart } = useCart()
  const { token } = useUser()

  const handlePay = async () => {
    if (!token) {
      // aqui va toast de shadcn
      return
    }

    try {
      await getFetch('http://localhost:5000/api/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart }),
      })

      if (hasError) {
        // aqui va toast error de shadcn
      } else {
        // aqui va toast success de shadcn
        cleanCart()
      }
    } catch (error) {
      // aqui va toast error de shadcn
    }
  }

  return (
    <section className='mx-auto'>
      <NavHome />
      <div className='container mx-auto my-10 px-4'>
        <h2 className='text-2xl font-bold text-gray-800'>Carrito de compras</h2>
        <div className='grid grid-cols-1 gap-4 mt-5 h-full'>
          {cart.length > 0 ? (
            cart.map(({ id, name, img, price, count }) => (
              <div
                key={id}
                className='bg-gray-100 flex items-center justify-between p-4 rounded shadow-md'
              >
                <div className='flex items-center'>
                  <img
                    src={img}
                    alt={name}
                    className='w-24 h-24 object-cover rounded'
                  />
                  <div className='p-4 flex flex-col justify-between'>
                    <h2 className='font-bold text-gray-800 text-xl uppercase'>
                      {name}
                    </h2>
                    <p className='text-gray-600 text-sm'>
                      <strong>Código:</strong>{' '}
                      <span className='uppercase'>{id}</span>
                    </p>
                    <div className='flex justify-between items-center mt-3'>
                      <span className='text-cyan-500 border-2 border-cyan-500 px-2 py-1 rounded-full font-bold'>
                        {toLocalString(price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center'>
                  <button
                    className='text-cyan-500 border-2 border-cyan-500 w-10 h-10 rounded-full font-bold hover:bg-cyan-500 hover:text-white cursor-pointer'
                    onClick={() => decrementCount(id)}
                  >
                    -
                  </button>
                  <span className='mx-4 font-bold text-cyan-500'>{count}</span>
                  <button
                    className='text-cyan-500 border-2 border-cyan-500 w-10 h-10 rounded-full font-bold hover:bg-cyan-500 hover:text-white cursor-pointer'
                    onClick={() => incrementCount(id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h2 className='text-2xl font-bold text-gray-800'>
              No hay productos en el carrito
            </h2>
          )}
        </div>

        <div className='flex flex-col items-end mt-5 p-4'>
          <h3 className='font-bold text-gray-800 text-xl uppercase'>
            Total: {toLocalString(total)}
          </h3>
          {cart.length > 0 && (
            <button
              onClick={handlePay}
              disabled={isLoading}
              className={`px-4 py-2 rounded mt-4 font-bold ${
                token
                  ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              {isLoading ? 'Procesando...' : 'Pagar'}
            </button>
          )}
        </div>

        {hasError && (
          <p className='text-xl text-red-500 text-center'>
            Error al procesar el pago, intenta de nuevo
          </p>
        )}

        {isLoading && (
          <div className='flex flex-col items-center'>
            {/* <Spinner /> */}
            <p className='text-xl text-gray-800 mt-5'>Procesando el pago...</p>
          </div>
        )}
      </div>
    </section>
  )
}
