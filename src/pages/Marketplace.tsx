import { useState, useEffect } from "react";
import { NavHome } from "@/components/NavHome";
import { ProductSection } from "../components/ProductSection";
import { useMarketplaceProducts, useSearchSales } from "../hooks/useQueries";
import { SearchBar } from "@/components/ui/SearchBar";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const Marketplace = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 6;

  const debouncedSearch = useDebounce(search, 400);
  const searchActive = debouncedSearch.trim() !== "";

  // Productos normales
  const { data, isLoading: isLoadingProducts } = useMarketplaceProducts(itemsPerPage, (currentPage - 1) * itemsPerPage);
  const products = data?.sales || [];
  const totalPages = data?.totalPages || 1;

  // Búsqueda
  const {
    data: searchData,
    isLoading: isLoadingSearch,
  } = useSearchSales(debouncedSearch, itemsPerPage, (currentPage - 1) * itemsPerPage, searchActive);

  // Determinar qué mostrar
  const showProducts = searchActive && searchData ? searchData.sales : products;
  const showTotalPages = searchActive && searchData ? searchData.totalPages : totalPages;
  const isLoading = searchActive ? isLoadingSearch : isLoadingProducts;

  // Cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Resetear página al cambiar búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  return (
    <div className='mx-auto max-w-7xl'>
      <NavHome />
      <SearchBar
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar carta..."
      />
      <ProductSection
        title="Marketplace"
        products={showProducts}
        totalPages={showTotalPages}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};
