import { useState, useEffect } from "react";
import { NavHome } from "@/components/NavHome";
import { ProductSection } from "../components/ProductSection";
import { useFetch } from "../hooks/useFetch";
import { CardTcgProps } from "../types/interfaces";

export const Marketplace = () => {
  const { isLoading, getFetch } = useFetch();
  const [products, setProducts] = useState<CardTcgProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchProducts = async (page: number) => {
    const offset = (page - 1) * itemsPerPage;
    const response = await getFetch(`https://tcg-market-api.onrender.com/sales?limit=${itemsPerPage}&offset=${offset}`);
    console.log('response', response)

    if (!response.hasError) {
      // ✅ Aseguramos que `data` sea un array, evitando errores
      setProducts(Array.isArray(response.data) ? response.data : []);
      setTotalPages(response.totalPages || 1);
    }
  };


  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className='mx-auto max-w-7xl'>
      <NavHome />
      <ProductSection
        title="Marketplace"
        products={products}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
      />
    </div>
  );
};
