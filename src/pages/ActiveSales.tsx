import { useEffect, useState } from "react";
import { useUser } from "@/context/UserProvider";
import { ProductSection } from "@/components/ProductSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const ActiveSales = () => {
  const { getActiveSales } = useUser();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      setError(null);

      const response = await getActiveSales(itemsPerPage, (currentPage - 1) * itemsPerPage);

      if (response.hasError) {
        setError(response.message ?? 'Ha ocurrido un error');
      } else {
        setProducts(response.data || []);
        setTotalPages(response.totalPages || 1);
      }

      setIsLoading(false);
    };

    fetchSales();
  }, [currentPage]);

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
