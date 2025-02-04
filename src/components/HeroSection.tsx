import { NavLink } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <section className="text-white text-center py-16 px-6 mt-5">
      <h1 className="text-4xl md:text-5xl font-extrabold uppercase">
        Haz crecer tu colección hoy
      </h1>
      <p className="text-xl md:text-2xl font-bold text-[#F19F00] mt-4 uppercase">
        Un espacio creado para los apasionados de los tcg
      </p>
      <NavLink
        to="/marketplace"
        className="mt-6 inline-block px-6 py-3 border border-[#F19F00] text-white rounded-lg hover:bg-[#F19F00] hover:text-black transition-all"
      >
        Explorar Marketplace
      </NavLink>
    </section >
  );
};
