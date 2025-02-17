import { useFetch } from '../hooks/useFetch'
import { useEffect } from 'react'
import { NavHome } from '../components/NavHome'
import { HeroSection } from '../components/HeroSection'
import { products } from '../mock/cards'
import { ProductSection } from '../components/ProductSection'
import { useState, useEffect } from 'react'

export const Home = () => {
  const { data, isLoading, hasError, getFetch } = useFetch()
  const [products, setProducts] = useState([])

  const baseUrl = 'https://tcg-market-api.onrender.com/cards'

  const getCards = async () => {
    const { data } = await getFetch(baseUrl)
    setProducts(data)
  }

  useEffect(() => {
    getCards()
  }, [])

  return (
    <>
      <section className='mx-auto my-10'>
        <NavHome />
        <HeroSection />
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white' />
          </div>
        ) : (
          <ProductSection
            title='Últimas Agregadas'
            products={products.slice(0, 3)}
            showMore={true}
          />
        )}
      </section>
    </>
  )
}
