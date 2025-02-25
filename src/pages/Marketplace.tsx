import { NavHome } from "@/components/NavHome";
import { ProductSection } from "../components/ProductSection";
// import { products } from '../mock/cards'
import { useFetch } from "../hooks/useFetch";
import { useState, useEffect } from "react";

export const Marketplace = () => {
  const { isLoading, getFetch } = useFetch()
  const [products, setProducts] = useState([])

  const baseUrl = 'https://tcg-market-api.onrender.com/sales'

  const getCards = async () => {
    const { data } = await getFetch(baseUrl)
    setProducts(data)
    console.log(data)
  }

  useEffect(() => {
    getCards()
  }, [])

  return (
    <div className='mx-auto max-w-7xl'>
      <NavHome />
      {isLoading ? (
        <div className="flex items-center justify-center pt-10">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
        </div>
      ) : (
        <ProductSection
          title="Marketplace"
          products={products}
          showMore={false}
        />
      )}

    </div>
  )
};

