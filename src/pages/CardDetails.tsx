import { useParams } from "react-router-dom";
import { products } from "../mock/cards";
import { NavHome } from "@/components/NavHome";

export const CardDetails = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  const product = products.find((item) => item.id === id); // Busca el producto por ID

  if (!product) {
    <NavHome />
    return (
      <div className="text-white text-center py-10">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
      </div>
    );
  }

  return (
    <>
      <NavHome />

      <div className="text-white min-h-screen flex justify-center items-center px-6 py-10">
        <div className="bg-[#090909]/40 p-6 rounded-lg border border-[#D9D9D9]/50 shadow-lg flex flex-col md:flex-row gap-6 max-w-4xl">
          <img src={product.image} alt={product.title} className="w-64 h-auto rounded-lg" />
          <div className="flex flex-col flex-1">
            <h1 className="text-2xl font-bold text-[#F19F00]">{product.title}</h1>
            <p className="text-sm text-gray-300">{product.set}</p>
            <p className="text-xl font-bold mt-4">Precio: {product.price}</p>
            <button className="mt-6 px-6 py-2 bg-[#F19F00] text-black font-bold rounded-lg hover:bg-[#D98C00]">
              Comprar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
