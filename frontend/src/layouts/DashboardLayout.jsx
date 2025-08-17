// DashboardLayout.jsx
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
{/*  */}
    <div className="flex flex-1">
      <div className="w-64">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </div>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  </div>

  )
}

export default DashboardLayout