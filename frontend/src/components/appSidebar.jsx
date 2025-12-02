import { NavLink } from "react-router-dom"
import {
  Calendar,
  Search,
  Users,
  User,
  Bell,
  Folder,
  MessageSquare,
  Settings,
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
  // { title: "Chat", url: "/chat", icon: MessageSquare },
]

// Productivity / utilities
const utilityItems = [
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: true },
  { title: "Files", url: "/files", icon: Folder },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  // Get the notification count from Redux
  const notificationCount = useSelector(state => state.notifications?.count || 0);

  return (
    <Sidebar className="w-64 min-h-screen mt-20 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
      <SidebarContent className="pt-6">
        {/* Main section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 transition-all duration-200 relative
                        ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 dark:border-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Utilities section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 px-3">
            Productivity
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 transition-all duration-200 relative
                        ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 dark:border-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.title}</span>
                      {/* Show badge for notifications if count > 0 */}
                      {item.badge && notificationCount > 0 && (
                        <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
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

        {/* User Profile Section (Optional) */}
        <div className="mt-auto px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                ChatMaster User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Always connected
              </p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}