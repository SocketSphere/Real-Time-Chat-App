import { ArrowBigRight, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router"

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center mt-100 justify-between px-5 md:px-16 bg-gray-50 dark:bg-gray-900">
      {/* Text Section */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-gray-800 dark:text-gray-100 leading-snug mb-4">
          Connect Instantly and Chat Seamlessly with Friends Worldwide
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
          Join our online chat platform to send messages, share media, and stay connected with your friends anytime, anywhere.
        </p>
        <Link 
          to="/chat" 
          className="inline-block mt-6 mb-2 px-6 py-3 bg-orange-400 dark:bg-orange-500 text-white dark:text-gray-900 font-medium rounded-md hover:bg-orange-500 dark:hover:bg-orange-400 hover:text-gray-800 dark:hover:text-white duration-300"
        >
          Start Chatting Now <ArrowBigRight className="inline-block ml-2" />
        </Link>

        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale gap-20 mt-10">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="/a1.jpg" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/a2.jpg" alt="@leerob" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="/a3.jpg"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
          <div> 
            <h1 className="font-bold text-2xl dark:text-gray-100">2200+</h1>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Happy Users</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <h1 className="font-bold text-4xl dark:text-gray-100 mr-2">4.9</h1>
              <span className="text-gray-500  text-4xl dark:text-gray-400">/5</span>
            </div>
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className="w-4 h-4 text-yellow-400 dark:text-yellow-300 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Rating</p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 flex justify-center rounded-md md:justify-end">
        <img
          src="/s1.png"
          alt="Chat illustration"
          className="w-84 md:w-96 h-800 object-contain"
        />
      </div>
    </section>
  )
}

export default Hero