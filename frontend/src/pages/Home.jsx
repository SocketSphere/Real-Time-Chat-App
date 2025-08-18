import BelowFeature from "../components/belowFeature"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import Feature from "../components/Feature"
import Last from "../components/Last"
import Conversation from "../components/Conversation"
import Order from "../components/Order"
import Subscribe from "../components/Subscribe"
import {InfiniteMovingCardsDemo} from "../components/inifinteCards"

const Home = () => {
  return (
    <div>
        <Hero/>
        <Feature/>
        <BelowFeature/>
        <Conversation/>
        <Order/>
        <Last/>
        <InfiniteMovingCardsDemo/>
        <Subscribe/>
        <Footer/>
    </div>
  )
}

export default Home
