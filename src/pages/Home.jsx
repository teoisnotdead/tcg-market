import { useFetch } from '../hooks/useFetch'
import { useEffect } from 'react'

export const Home = () => {
  const { data, isLoading, hasError, getFetch } = useFetch();

  useEffect(() => {
    getFetch('');
  }, [getFetch]);

  return (
    <>
      <section className='container mx-auto my-10 px-4'>
        <h2>TCG Market</h2>
        <p className='text-gray-600 text-sm'>
          Una aplicación de comercio electrónico para comprar y vender cartas
        </p>
      </section>
    </>
  )
}
