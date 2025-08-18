import Hero from "../components/Hero"
import Footer from "../components/Footer"
import Feature from "../components/Feature"
import BelowFeature from "../components/BelowFeature"
import Order from "../components/Order"
import Subscribe from "../components/Subscribe"
import Last from "../components/Last"
import Conversation from "../components/Conversation"
import { InfiniteMovingCardsDemo } from "../components/InfiniteMovingCards"


const Home = () => {
  return (
    <div >
      <Hero/>
      <Feature/>
      <BelowFeature/>
      <Order/>
      <Conversation/>
      <InfiniteMovingCardsDemo/>
      <Subscribe/>
      <Last/>
      <Footer />
    </div>
  )
}

export default Home