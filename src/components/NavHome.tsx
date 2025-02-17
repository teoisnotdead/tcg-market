import { useUser } from "@/context/UserProvider";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { name: "Inicio", path: "/" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "Contacto", path: "/contacto" },
];

export const NavHome = (): JSX.Element => {
  const { getDataFromLocalStorage } = useUser();
  const [dataUser, setDataUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const userData = getDataFromLocalStorage();
    if (userData.token) {
      setDataUser({ name: userData.name });
    }
  }, []);

  const logo = "/TCG-Market-logo.png";

  return (
    <div className="flex justify-between items-center px-36">
      <div className="flex items-center">
        <NavLink to="/">
          <img src={logo} alt="logo" className="w-52 h-auto" />
        </NavLink>
      </div>

      <nav className="flex justify-center mt-4">
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

      <div className="flex items-center">
        {dataUser ? (
          <NavLink to="/cuenta" className="flex items-center">
            <span className="ml-4 text-white text-sm font-bold">
              {dataUser.name}
            </span>
          </NavLink>
        ) : (
          <NavLink to="/login">
            <span className="text-zinc-50 hover:text-zinc-700 cursor-pointer">
              Acceder
            </span>
          </NavLink>
        )}
      </div>
    </div>
  );
};
