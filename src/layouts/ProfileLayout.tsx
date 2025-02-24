import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { NavLink, Outlet } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export const ProfileLayout = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <nav className="hidden md:flex gap-4">
              <NavLink to="/" className="text-white text-sm hover:underline">
                Página de inicio
              </NavLink>
              <NavLink to="/marketplace" className="text-white text-sm hover:underline">
                Marketplace
              </NavLink>
              <NavLink to="/cart" className="text-white text-sm hover:underline">
                Carrito
              </NavLink>
            </nav>

            <div className="md:hidden flex ml-auto">
              <button className="text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </header>

        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[#D9D9D9]/90 backdrop-blur-md text-white shadow-lg px-6 py-4 flex flex-col space-y-3 border-b border-gray-500">
            <NavLink to="/" className="py-2 text-lg hover:underline" onClick={() => setIsOpen(false)}>
              Página de inicio
            </NavLink>
            <NavLink to="/marketplace" className="py-2 text-lg hover:underline" onClick={() => setIsOpen(false)}>
              Marketplace
            </NavLink>
            <NavLink to="/cart" className="py-2 text-lg hover:underline" onClick={() => setIsOpen(false)}>
              Carrito
            </NavLink>
          </div>
        )}

        {/* 📌 Sección de contenido dinámico */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-6">
          <Outlet /> {/* 📌 Aquí se renderizan las páginas dinámicas */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
