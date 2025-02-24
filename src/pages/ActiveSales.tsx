import { useEffect, useState } from "react";
import { useUser } from "@/context/UserProvider";
import { ProductSection } from "@/components/ProductSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const ActiveSales = () => {
  const { getActiveSales } = useUser();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      setError(null);

      const response = await getActiveSales();
      if (response.hasError) {
        setError(response.message ?? 'Ha ocurrido un error')
      } else {
        setProducts(response.data || []);
      }

      setIsLoading(false);
    };

    fetchSales();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-40 rounded-lg" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ProductSection
      title="Tus Ventas Activas"
      products={products}
      showMore={false}
    />
  );
};
