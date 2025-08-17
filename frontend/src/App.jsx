// app.jsx
import { Route, Routes } from "react-router"
import Chat from "./components/Chat"
import Contact from "./components/Contact"
import NotFound from "@/components/NotFound"
import Group from "./components/Group"
import Home from "./pages/Home"
function App() {

  return (
   <div>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/notfound" element={<NotFound/>}/>
        <Route path="/group" element={<Group/>}/>


     </Routes>
   </div>
  )
}

export default App
