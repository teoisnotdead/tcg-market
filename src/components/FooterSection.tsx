// import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Twitter } from "lucide-react";

export const FooterSection: React.FC = () => {
  return (
    <footer className="text-white py-10 px-6 text-center flex flex-col items-center">
      {/* Logo */}
      <img src="./TCG-Market-logo.png" alt="Logo" className="w-60 h-auto" />
      {/* 

      {/* Íconos de redes sociales con Lucide */}
      <div className="flex justify-center space-x-6 mt-6 text-2xl">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F19F00] transition-all">
          <Instagram size={24} />
        </a>
        <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" className="hover:text-[#F19F00] transition-all">
          <MessageCircle size={24} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F19F00] transition-all">
          <Twitter size={24} />
        </a>
      </div>

      {/* Texto de derechos */}
      <p className="mt-6 text-xs text-gray-400 uppercase">
        <span className="text-[#F19F00]"></span>
        © 2025 <span className="text-[#F19F00]">TCG MARKET</span>.
        Desarrollado por <span className="text-[#F19F00]">Alfredo Saavedra </span> 
        para <span className="text-[#F19F00]">Desafío Latam</span>.
      </p>
    </footer>
  );
};
