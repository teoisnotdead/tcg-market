import { Github, Instagram, MessageCircle, Twitter } from "lucide-react";
const logo = "/TCG-Market-logo.png";

export const FooterSection: React.FC = () => {
  return (
    <footer className="text-white py-10 px-6 text-center flex flex-col items-center">
      {/* Logo */}
      <img src={logo} alt="logo" className="w-60 h-auto" />
      {/* 

      {/* Íconos de redes sociales con Lucide */}
      <div className="flex justify-center space-x-6 mt-6 text-2xl">
        <a href="https://instagram.com/teoisnotdead" target="_blank" rel="noopener noreferrer" className="hover:text-[#F19F00] transition-all">
          <Instagram size={24} />
        </a>
        <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" className="hover:text-[#F19F00] transition-all">
          <MessageCircle size={24} />
        </a>
        <a href="https://twitter.com/teoisnotdead" target="_blank" rel="noopener noreferrer" className="hover:text-[#F19F00] transition-all">
          <Twitter size={24} />
        </a>
        <a href="https://github.com/teoisnotdead" target="_blank" rel="noopener noreferrer" className="hover:text-[#F19F00] transition-all">
          <Github size={24} />
        </a>
      </div>

      {/* Texto de derechos */}
      <p className="mt-6 text-xs text-gray-400 uppercase">
        <span className="text-[#F19F00]"></span>
        © 2025 <span className="text-[#F19F00]">TCG MARKET</span>.
        Desarrollado por <a href="https://teodev.cl" target="_blank" rel="noopener noreferrer" className="hover:text-[#F19F00] transition-all">Alfredo Saavedra</a>
        para <span className="text-[#F19F00]">Desafío Latam</span>.
      </p>
    </footer>
  );
};
