import Hero from "../components/Hero"
import Footer from "../components/Footer"
import Feature from "../components/Feature"
import BelowFeature from "../components/BelowFeature"
import Conversation from "../components/Conversation"
import Order from "../components/Order"
import {InfiniteMovingCardsDemo} from "@/components/InifinteCards"
import Last from "../components/Last"
import Subscribe from "@/components/Subscribe"
const Home = () => {
  return (
    <div>
      <Hero/>
      <Feature/>
      <BelowFeature/>
      <Conversation/>
      <Order/>
      <InfiniteMovingCardsDemo/>
      <Last/>
      <Subscribe />
      <Footer />
    </div>
  )
}

export default Home