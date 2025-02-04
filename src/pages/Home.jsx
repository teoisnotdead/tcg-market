import { useFetch } from '../hooks/useFetch'
import { useEffect } from 'react'
import { NavHome } from '../components/NavHome'
import { HeroSection } from '../components/HeroSection'
import { products } from '../mock/cards'
import { ProductSection } from '../components/ProductSection'

export const Home = () => {
  const { data, isLoading, hasError, getFetch } = useFetch()

  useEffect(() => {
    getFetch('')
  }, [getFetch])

  return (
    <>
      <section className='mx-auto my-10'>
        <NavHome />
        <HeroSection />
        <ProductSection
          title='Últimas Agregadas'
          products={products.slice(0, 3)}
          showMore={true}
        />
      </section>
    </>
  )
}
