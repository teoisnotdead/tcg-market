import { useState } from "react";
import { NavHome } from "@/components/NavHome";
import { ProductSection } from "../components/ProductSection";
import { useMarketplaceProducts } from "../hooks/useQueries";

export const Marketplace = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { data, isLoading } = useMarketplaceProducts(itemsPerPage, (currentPage - 1) * itemsPerPage);
  const products = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.totalPages || 1;

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
