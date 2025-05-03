import { useEffect, useState } from "react";
import { useUser } from "@/context/UserProvider";
import { ProductSection } from "@/components/ProductSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useActiveSales } from "../hooks/useQueries";

export const ActiveSales = () => {
  const { token } = useUser();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 6;

  const { data, isLoading: queryLoading, isError } = useActiveSales(token, itemsPerPage, (currentPage - 1) * itemsPerPage);

  useEffect(() => {
    setIsLoading(queryLoading);
    if (queryLoading) return;
    if (isError) {
      setError('Ha ocurrido un error');
      setProducts([]);
      setTotalPages(1);
      return;
    }
    if (data && Array.isArray(data.data)) {
      setProducts(data.data);
      setTotalPages(data.totalPages || 1);
      setError(null);
    }
  }, [data, queryLoading, isError]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <ProductSection
        title="Tus Ventas Activas"
        products={products}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
        showMore={false}
        skeletonCount={6}
      />
    </div>
  );
};
