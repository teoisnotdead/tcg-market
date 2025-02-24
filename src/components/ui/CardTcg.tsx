import { Link } from "react-router-dom";
import { toLocalString } from "../../utils/toLocalString";
import { CardTcgProps } from "../../types/interfaces";

export const CardTcg: React.FC<CardTcgProps> = ({ id, image_url, name, description, price }) => {

  return (
    <div className="bg-[#090909]/40 text-white p-4 rounded-lg transition-all border border-transparent hover:border-[#D9D9D9]/50 hover:shadow-lg hover:shadow-white/20">
      <div className="md:flex gap-4">
        <img src={image_url} alt={name} className="w-32 h-auto rounded-lg" />

        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-[#F19F00] font-bold text-lg">{name}</h3>
            <p className="text-sm text-gray-300">{description}</p>
            <p className="text-md font-bold mt-2">Precio: {toLocalString(price)}</p>
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
