import { useUser } from "@/context/UserProvider";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Inicio", path: "/" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "Carrito", path: "/cart" },
];

export const NavHome = (): JSX.Element => {
  const { getDataFromLocalStorage } = useUser();
  const [dataUser, setDataUser] = useState<{ name: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userData = getDataFromLocalStorage();
    if (userData.token) {
      setDataUser({ name: userData.name });
    }
  }, []);

  const logo = "/TCG-Market-logo.png";

  return (
    <div className="flex justify-between items-center px-6 md:px-36 py-4">
      {/* 🔹 Logo */}
      <div className="flex items-center">
        <NavLink to="/">
          <img src={logo} alt="logo" className="w-40 md:w-52 h-auto" />
        </NavLink>
      </div>

      <nav className="hidden md:flex justify-center items-center">
        <div className="flex bg-[#D9D9D9]/20 text-white rounded-full px-4 py-2 space-x-6 border border-gray-500">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-1 rounded-full transition-all ${isActive ? "text-[#F19F00] font-bold" : "text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="hidden md:flex items-center ml-6">
        {dataUser ? (
          <NavLink to="/cuenta" className="text-white text-sm font-bold">
            {dataUser.name}
          </NavLink>
        ) : (
          <NavLink to="/login" className="text-zinc-50 hover:text-zinc-700">
            Acceder
          </NavLink>
        )}
      </div>

      <div className="md:hidden flex items-center">
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 right-4 bg-[#D9D9D9]/90 backdrop-blur-md text-white rounded-lg shadow-lg px-6 py-4 flex flex-col space-y-3 border border-gray-500">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `py-2 text-lg ${isActive ? "text-[#F19F00] font-bold" : "text-white"}`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          {dataUser ? (
            <NavLink
              to="/cuenta"
              className="py-2 text-lg text-white"
              onClick={() => setIsOpen(false)}
            >
              {dataUser.name}
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="py-2 text-lg text-zinc-50 hover:text-zinc-700"
              onClick={() => setIsOpen(false)}
            >
              Acceder
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
};
