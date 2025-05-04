import { useUser } from "../context/UserProvider";
import { ProductSection } from "@/components/ProductSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUserFavorites } from "../hooks/useQueries";
import { useState } from "react";

export const Favorites = () => {
  const { token } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const offset = (currentPage - 1) * itemsPerPage;
  
  const { data, isLoading, isError } = useUserFavorites(token, itemsPerPage, offset);

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Ha ocurrido un error al cargar tus favoritos</AlertDescription>
      </Alert>
    );
  }

  // Soportar ambos formatos de respuesta
  const favorites = Array.isArray(data) ? data : data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mx-auto max-w-7xl">
      <ProductSection
        title="Tus Favoritos"
        products={favorites}
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