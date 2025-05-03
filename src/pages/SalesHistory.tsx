import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import { SaleData } from "../types/interfaces";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toLocalString } from "../utils/toLocalString";
import { useAllSales } from "../hooks/useQueries";

export const SalesHistory = () => {
  const { token } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { data, isLoading, isError } = useAllSales(token, itemsPerPage, (currentPage - 1) * itemsPerPage);
  const [sales, setSales] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(isLoading);
    if (isLoading) return;
    // Soporta tanto array plano como objeto con data
    let ventas: SaleData[] = [];
    if (Array.isArray(data)) {
      ventas = data;
    } else if (data && Array.isArray(data.data)) {
      ventas = data.data;
      setTotalPages(data.totalPages || 1);
    }
    setSales(ventas);
    setLoading(false);
  }, [data, isLoading, isError]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial de Ventas</h1>
      <div className="border rounded-lg shadow-sm">
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : sales.length === 0 ? (
          <p className="text-center p-6 text-gray-400">No tienes ventas en tu historial.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
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
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${sale.status === "sold" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
                      {sale.status === "sold" ? "Vendida" : "Disponible"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/card/${sale.id}`)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {/* Paginación fuera del borde */}
      {sales.length > 0 && (
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
      )}
    </div>
  );
};
