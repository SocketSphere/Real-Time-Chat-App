// import Image from 'next/image';
import { ArrowBigRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center mt-100 justify-between px-5 md:px-16  bg-gray-50">
      {/* Text Section */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-gray-800 leading-snug mb-4">
          Connect Instantly and Chat Seamlessly with Friends Worldwide
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Join our online chat platform to send messages, share media, and stay connected with your friends anytime, anywhere.
        </p>
        <button className="text-white rounded-md ml-6 m-4 p-4 bg-orange-400 hover:bg-orange-500 hover:text-gray-800 hover:rounded-md duration-300">
          Start Chatting Now <ArrowBigRight className="inline-block ml-2" />
        </button>

        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale gap-20">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-20"> 
            <h1 className="font-bold">2200+</h1>
            <div>
              <p className="text-gray-500">Happy Users</p>
            </div>
          </div>
          <div>
            <img src="/s5.png" alt="" />
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
