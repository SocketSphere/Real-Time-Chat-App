
// import Footer from "../components/(HomePage)/Footer"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/appSidebar.jsx"

const Home = () => {
  return (
    <div className="dark">
      {/* <Navbar /> */}

      {/* SidebarProvider wraps Sidebar + main content */}
      <SidebarProvider>
        <div className="flex">
          {/* Sidebar on the left */}
          <AppSidebar />

          {/* Main content */}
          {/* <div className="flex-1">
            <Hero />
          </div> */}
        </div>
      </SidebarProvider>

      {/* <Footer /> */}
    </div>
  )
}

export default Home