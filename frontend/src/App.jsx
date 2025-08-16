import { Routes, Route } from "react-router-dom"
import DashboardLayout from "@/layouts/DashboardLayout"
import Home from "./pages/Home"
import Chat from "./components/Chat"
import Contact from "./components/Contact"
import Group from "./components/Group"
import NotFound from "./components/NotFound"

function App() {
  return (
    <div >
      <Routes>
      {/* Routes with Navbar + Sidebar */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/group" element={<Group />} />
      </Route>

      {/* Routes without Navbar + Sidebar */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
    
  )
}

export default App
