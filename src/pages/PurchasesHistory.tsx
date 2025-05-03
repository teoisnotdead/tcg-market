import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import { SaleData } from "../types/interfaces";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toLocalString } from "../utils/toLocalString";
import { toFormatDate } from "../utils/toFormatDate";
import { useAllPurchases } from "../hooks/useQueries";

export const PurchasesHistory = () => {
  const { token } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { data, isLoading, isError } = useAllPurchases(token, itemsPerPage, (currentPage - 1) * itemsPerPage);
  const [sales, setSales] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(isLoading);
    if (isLoading) return;
    if (data && !isError && Array.isArray(data.data)) {
      setSales(data.data);
      setTotalPages(data.totalPages || 1);
    }
    setLoading(false);
  }, [data, isLoading, isError]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial de Compras</h1>
      <div className="border rounded-lg shadow-sm">
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : sales.length === 0 ? (
          <p className="text-center p-6 text-gray-400">No tienes compras en tu historial.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Comprada</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <img src={sale.image_url} alt={sale.name} className="w-16 h-auto rounded" />
                    </TableCell>
                    <TableCell>{sale.name}</TableCell>
                    <TableCell>{toLocalString(sale.price)}</TableCell>
                    <TableCell>{toFormatDate(sale.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/card/${sale.sale_id}`)}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Paginación */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Button
                  key={idx}
                  variant={currentPage === idx + 1 ? "default" : "outline"}
                  size="sm"
                  className="mx-1"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
