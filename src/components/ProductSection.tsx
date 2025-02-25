import { CardTcg } from "./ui/CardTcg";
import { CardTcgProps } from "../types/interfaces";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export const ProductSection: React.FC<{
  title?: string;
  products: CardTcgProps[];
  totalPages?: number;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  isLoading: boolean;
  showMore?: boolean;
  skeletonCount?: number;
}> = ({
  title = "Últimas Agregadas",
  products,
  totalPages = 1,
  currentPage = 1,
  setCurrentPage,
  isLoading,
  showMore,
  skeletonCount = 6,
}) => {
    return (
      <section className="text-white py-6 px-4 sm:px-10 md:px-20 max-w-screen-xl mx-auto">
        <h2 className="text-xl font-bold mb-6">{title}</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-full rounded-lg bg-gray-700" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center">No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <CardTcg key={product.id} {...product} />
            ))}
          </div>
        )}

        {showMore && (
          <div className="text-right mt-6">
            <Link
              to="/marketplace"
              className="text-white text-sm hover:underline"
            >
              Ver Más
            </Link>
          </div>
        )}

        {(totalPages ?? 1) > 1 && (
          <div className="flex justify-center items-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage && setCurrentPage(Math.max(currentPage - 1, 1))}
                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>

                {[...Array(totalPages ?? 1)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={() => setCurrentPage && setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {(totalPages ?? 1) > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => setCurrentPage && setCurrentPage(Math.min(currentPage + 1, totalPages ?? 1))}
                    className={currentPage === (totalPages ?? 1) ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    );
  };
