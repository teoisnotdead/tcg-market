import * as React from "react"
import {
  BadgeCheck,
  GalleryVerticalEnd,
  HandCoins,
  ShoppingCart,
  UserPen,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useEffect } from 'react'
import { useUser } from '../context/UserProvider'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { getUserData, name, email } = useUser()

  useEffect(() => {
    getUserData()
  }, [])

  const data = {
    user: {
      name: name || "Cargando...",
      email: email || "Cargando...",
      avatar: "/io.webp",
    },
    teams: [
      {
        name: "Mi cuenta",
        logo: BadgeCheck,
        plan: "Plan básico",
      },
    ],
    navMain: [
      {
        title: "Perfil",
        url: "#",
        icon: UserPen,
        isActive: true,
        items: [
          {
            title: "General",
            url: "#"
          },
          {
            title: "Configuración",
            url: "#",
          },
        ],
      },
      {
        title: "Ventas",
        url: "#",
        icon: HandCoins,
        items: [
          {
            title: "Crear nueva venta",
            url: "/cuenta/nueva-venta",
          },
          {
            title: "Mis ventas",
            url: "#",
          },
          {
            title: "Historial de ventas",
            url: "#",
          },
        ],
      },
      {
        title: "Compras",
        url: "#",
        icon: ShoppingCart,
        items: [
          {
            title: "Mis compras",
            url: "#",
          },
          {
            title: "Historial de compras",
            url: "#",
          },
        ],
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenu>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Mi cuenta</span>
                  <span className="text-xs text-muted-foreground">Plan básico</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
