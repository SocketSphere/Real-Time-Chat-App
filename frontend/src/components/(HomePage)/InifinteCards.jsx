"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[25rem] rounded-md flex flex-col antialiased bg-orange-100 dark:bg-gray-900 dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          What Our Users Say
        </h2>
        <InfiniteMovingCards 
          items={testimonials} 
          direction="right" 
          speed="slow" 
        />
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "ChatMaster has completely transformed how I communicate with my team. The seamless integration and real-time features make collaboration effortless.",
    name: "Alex Johnson",
    title: "Product Manager",
    avatar: "/a1.jpg",
  },
  {
    quote:
      "The video quality is outstanding and the interface is so intuitive. It's made remote work feel just as connected as being in the office.",
    name: "Sarah Miller",
    title: "UX Designer",
    avatar: "/a2.jpg",
  },
  {
    quote: "Security was my biggest concern, but ChatMaster's encryption gives me peace of mind. Best communication tool we've implemented.",
    name: "David Chen",
    title: "Security Analyst",
    avatar: "/a3.jpg",
  },
  {
    quote:
      "As a customer support lead, the direct order feature has increased our sales by 40%. The chat interface is smooth and professional.",
    name: "Maria Rodriguez",
    title: "Customer Support Lead",
    avatar: "/a4.jpg",
  },
  {
    quote:
      "The group chat functionality is perfect for our remote team. File sharing and video calls work flawlessly every time.",
    name: "James Wilson",
    title: "Team Lead",
    avatar: "/a5.jpg",
  },
];