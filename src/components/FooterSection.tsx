import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Twitter } from "lucide-react";

export const FooterSection: React.FC = () => {
  return (
    <footer className="text-white py-10 px-6 text-center flex flex-col items-center">
      {/* Logo */}
      <img src="./TCG-Market-logo.png" alt="Logo" className="w-60 h-auto" />

      {/* Menú de enlaces */}
      <nav className="mt-4 flex justify-center space-x-6 text-sm">
        <Link to="/sobre-nosotros" className="hover:text-[#F19F00] transition-all">
          Sobre nosotros
        </Link>
        <Link to="/terminos" className="hover:text-[#F19F00] transition-all">
          Términos
        </Link>
        <Link to="/contacto" className="hover:text-[#F19F00] transition-all">
          Contacto
        </Link>
        <Link to="/privacidad" className="hover:text-[#F19F00] transition-all">
          Privacidad
        </Link>
      </nav>

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
      <p className="mt-6 text-xs text-gray-400">
        © 2025 TCG MARKET. DESARROLLADO POR TEODEV. PROYECTO FINAL PARA DESAFÍO LATAM
      </p>
    </footer>
  );
};
