import { NavLink } from "react-router-dom"
import {
  Calendar,
  Search,
  Users,
  User,
  Bell,
  Folder,
} from "lucide-react"

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

// Import useSelector from react-redux
import { useSelector } from "react-redux";

// Main navigation items
const mainItems = [
  { title: "Contacts", url: "/contact", icon: User },
  { title: "Groups", url: "/group", icon: Users },
  { title: "Search", url: "/search", icon: Search },
]

// Productivity / utilities
const utilityItems = [
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: true },
  { title: "Files", url: "/files", icon: Folder },
]

export function AppSidebar() {
  // const location = useLocation()
  // Get the notification count from Redux
  const notificationCount = useSelector(state => state.notifications.count);

  return (
    <Sidebar className="w-64 min-h-screen mt-20">
      <SidebarContent>
        {/* Main section */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2 py-1 rounded-md transition-colors
                        ${
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Utilities section */}
        <SidebarGroup>
          <SidebarGroupLabel>Productivity</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2 py-1 rounded-md transition-colors relative
                        ${
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {/* Show badge for notifications if count > 0 */}
                      {item.badge && notificationCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                      )}
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