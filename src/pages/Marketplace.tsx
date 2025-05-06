import { useState, useEffect, useRef } from "react";
import { NavHome } from "@/components/NavHome";
import { ProductSection } from "../components/ProductSection";
import { useMarketplaceProducts, useSearchSales } from "../hooks/useQueries";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const itemsPerPage = 6;
  const categoryFilterRef = useRef<any>(null);

  const debouncedSearch = useDebounce(search, 400);
  const isTextSearch = debouncedSearch.trim() !== "";
  const isCategoryFilter = !isTextSearch && selectedCategories.length > 0;

  // Productos normales o filtrados por categoría
  const { data: productsData, isLoading: isLoadingProducts } = useMarketplaceProducts(
    itemsPerPage,
    (currentPage - 1) * itemsPerPage,
    isCategoryFilter ? selectedCategories : []
  );
  const products = productsData?.sales || [];
  const totalPages = productsData?.totalPages || 1;

  // Búsqueda por texto (puede incluir categorías)
  const {
    data: searchData,
    isLoading: isLoadingSearch,
  } = useSearchSales(
    debouncedSearch,
    itemsPerPage,
    (currentPage - 1) * itemsPerPage,
    isTextSearch,
    selectedCategories
  );

  // Determinar qué mostrar
  const showProducts = isTextSearch && searchData ? searchData.sales : products;
  const showTotalPages = isTextSearch && searchData ? searchData.totalPages : totalPages;
  const isLoading = isTextSearch ? isLoadingSearch : isLoadingProducts;

  // Cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Resetear página al cambiar búsqueda o categorías
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategories]);

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    if (categoryFilterRef.current) {
      categoryFilterRef.current.clearFilters();
    }
  };

  return (
    <div className='mx-auto max-w-7xl'>
      <NavHome />
      <div className="px-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <CategoryFilter ref={categoryFilterRef} onCategoriesChange={handleCategoriesChange} onClearFilters={handleClearFilters} />
          <div className="flex-1 w-full">
            <SearchBar
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar carta..."
            />
          </div>
        </div>
        <ProductSection
          title="Marketplace"
          products={showProducts}
          totalPages={showTotalPages}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
