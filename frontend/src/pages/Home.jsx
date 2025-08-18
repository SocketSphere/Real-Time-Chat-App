import BelowFeature from "../components/belowFeature"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import Feature from "../components/Feature"
import Last from "../components/Last"
import Conversation from "../components/Conversation"

const Home = () => {
  return (
    <div>
        <Hero/>
        <Conversation/>
        <Footer/>
        <Feature/>
        <Last/>

        <BelowFeature/>
    </div>
  )
}

export default Home
