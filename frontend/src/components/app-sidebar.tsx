import { useLocation } from "react-router-dom"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { NavLink } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Inbox", url: "/chat", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Search", url: "/search", icon: Search },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()

  // Change sidebar bg color depending on current page    ${bgColor}`
  // const bgColor = location.pathname === "/" ? "bg-black text-white" : "bg-white text-gray-800"

  return (
    <Sidebar className={"w-64 min-h-screen mt-20" }>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-1 rounded-md 
                      ${isActive ? "bg-gray-800 text-white" : "text-gray-700 dark:text-gray-200"}`
                    }
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
