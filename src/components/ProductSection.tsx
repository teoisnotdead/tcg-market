import { Link } from "react-router-dom";
import { CardTcg } from "./ui/CardTcg";
import { ProductSectionProps } from "../types/interfaces";

export const ProductSection: React.FC<ProductSectionProps> = ({
  title = "Últimas Agregadas",
  products,
  showMore = false,
}) => {
  return (
    <section className="text-white py-6 px-4 sm:px-10 md:px-20 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">{title}</h2>

      {products.length === 0 ? (
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
    </section>
  );
};
