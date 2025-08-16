
import { Route, Routes } from 'react-router'
import SignUp from './components/SignUp'
import About from './components/Chat'
import Login from './components/Contact'
import Home from './pages/Home'
import NotFound from './components/NotFound'
import Chat from './components/Chat'
import Contact from "./components/Contact"
import Group from "./components/Group"

function App() {
  return (
    <div data-theme="forest">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="*" element={<NotFound />} />
        <Route path="/group" element={<Group/>}/>
      </Routes>
    </div>
  )
}

export default App