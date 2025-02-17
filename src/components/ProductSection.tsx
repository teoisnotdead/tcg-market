import { Link } from "react-router-dom";
import { CardTcg } from "./ui/CardTcg"

interface ProductSectionProps {
  title?: string;
  products: {
    id: string;
    image: string;
    title: string;
    set: string;
    price: string;
    link?: string;
  }[];
  showMore?: boolean;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title = "Últimas Agregadas",
  products,
  showMore = false,
}) => {
  return (
    <section className="text-white py-10 px-36">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <CardTcg key={index} {...product} />
        ))}
      </div>
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

