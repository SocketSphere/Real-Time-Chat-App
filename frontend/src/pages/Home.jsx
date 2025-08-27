import { useEffect } from "react"
import BelowFeature from "../components/(HomePage)/BelowFeature"
import Footer from "../components/(HomePage)/Footer"
import Hero from "../components/(HomePage)/Hero"
import Feature from "../components/(HomePage)/Feature"
import Last from "../components/(HomePage)/Last"
import Conversation from "../components/(HomePage)/Conversation"
import Order from "../components/(HomePage)/Order"
import Subscribe from "../components/Subscribe"
import {InfiniteMovingCardsDemo} from "../components/(HomePage)/InifinteCards"
import Price from "../components/(Navbar)/Price"
import { useLocation } from "react-router"
const Home = () => {
  const location= useLocation();
  useEffect(() => {
    if (location.state?.scrollToPricing) {
      const section = document.getElementById("pricing");
      section?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  return (
    <div>
        <Hero/>
        <Feature/>
        <BelowFeature/>
        <Conversation/>
        <Order/>
        <Last/>
        <Price/>
        <InfiniteMovingCardsDemo/>
        <Subscribe/>
        <Footer/>
    </div>
  )
}

export default Home
