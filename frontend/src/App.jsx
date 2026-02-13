// app.jsx
import { Route, Routes } from "react-router"
import Chat from "./components/Chat"
import Contact from "./components/Contact"
import NotFound from "./components/NotFound"
import Group from "./components/Group"
import Home from "./pages/Home"
import DashboardLayout from "./layouts/DashboardLayout"
import AboutUs from "./components/(Navbar)/AboutUs"
// import Inbox from "@/components/AppSidebar/Inbox"
import Calendar from "./components/AppSidebar/Calendar"
import Search  from "./components/AppSidebar/Search"
import Files from "./components/AppSidebar/Files"
import SignUp from "./components/(profile)/SignUp"
import Profile from "./components/(profile)/Profile"
import Login from "./components/(profile)/Login"
import Notifications from "./components/AppSidebar/Notifications"
import Price from "./components/(Navbar)/Price"
import Setting from "./components/Settings/Setting"
import { Toaster } from "react-hot-toast";
import ChatPage from "./components/ChatPage"
import GroupChatPage from "./components/GroupChatPage"
import useNotificationCount from './hooks/useNotificationCount';
import useWebSocket from './hooks/useWebSocket';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import { ThemeProvider } from "./components/theme-provider";
import Ai from "./components/ai"
function App() {
  useNotificationCount();
  useWebSocket();
  return (

    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/ai" element={<Ai/>}/>
          
          
          <Route path="*" element={<NotFound/>}/>


          <Route element={<DashboardLayout/>}>
            {/* <Route path="/inbox" element={<Inbox/>}/> */}
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
    </ThemeProvider>
   
  )
}

export default App
