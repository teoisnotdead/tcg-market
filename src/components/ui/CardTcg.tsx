import { Link } from "react-router-dom";

interface CardTcgProps {
  id: string;
  image: string;
  title: string;
  set: string;
  price: string;
  link?: string;
}

export const CardTcg: React.FC<CardTcgProps> = ({ id, image, title, set, price }) => {
  return (
    <div className="bg-[#090909]/40 text-white p-4 rounded-lg transition-all border border-transparent hover:border-[#D9D9D9]/50 hover:shadow-lg hover:shadow-white/20">
      <div className="flex gap-4">
        <img src={image} alt={title} className="w-32 h-auto rounded-lg" />

        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-[#F19F00] font-bold text-lg">{title}</h3>
            <p className="text-sm text-gray-300">{set}</p>
            <p className="text-md font-bold mt-2">Precio: {price}</p>
          </div>

          <div className="flex justify-end mt-2">
            <Link to={`/card/${id}`} className="px-3 py-1 text-sm border border-[#F19F00] text-white rounded-lg hover:bg-[#F19F00] hover:text-black transition-all">
              Detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
