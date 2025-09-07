// app.jsx
import { Route, Routes } from "react-router"
import Chat from "./components/Chat"
import Contact from "./components/Contact"
import NotFound from "@/components/NotFound"
import Group from "./components/Group"
import Home from "./pages/Home"
import DashboardLayout from "@/Layouts/DashBoardLayout"
import AboutUs from "@/components/(Navbar)/AboutUs"
import Inbox from "@/components/AppSidebar/Inbox"
import Calendar from "./components/AppSidebar/Calendar"
import Search  from "./components/AppSidebar/Search"
import Files from "./components/AppSidebar/Files"
import SignUp from "./components/(profile)/SignUp"
import Profile from "@/components/(Profile)/Profile"
import Login from "./components/(profile)/Login"
import Notifications from "./components/AppSidebar/Notifications"
import Price from "./components/(Navbar)/Price"
import Setting from "./components/settings/Setting"
import { Toaster } from "react-hot-toast";
import ChatPage from "./components/ChatPage"
import GroupChatPage from "./components/GroupChatPage"
function App() {

  return (
   <div>
    <Toaster
        position="top-center"
        reverseOrder={false}
      />
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/notfound" element={<NotFound/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/price" element={<Price/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/settings" element={<Setting/>}/>
        
        <Route path="*" element={<NotFound/>}/>


        <Route element={<DashboardLayout/>}>
           <Route path="/inbox" element={<Inbox/>}/>
           <Route path="/calendar" element={<Calendar/>}/>
           <Route path="/files" element={<Files/>}/>
           <Route path="/search" element={<Search/>}/>
           <Route path="/contact" element={<Contact/>}/>
            <Route path="/chat/:friendId" element={<ChatPage />} />
           <Route path="/group/:groupId" element={<GroupChatPage />} />
           <Route path="/group" element={<Group/>}/>
           <Route path="/contact" element={<Contact/>}/>
           <Route path="/notifications" element={<Notifications/>}/>
        </Route>
       
     </Routes>
   </div>
  )
}

export default App
