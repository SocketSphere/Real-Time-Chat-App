// // src/middleware/ratelimiter.js
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// // Create a Redis client
// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,   // From your .env
//   token: process.env.UPSTASH_REDIS_REST_TOKEN, // From your .env
// });

// // Create a rate limiter (e.g., 5 requests per minute)
// const ratelimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(5, "1 m"),
// });

// const rateLimiter = async (req, res, next) => {
//   try {
//     const ip = req.ip; // Or req.headers["x-forwarded-for"] || req.connection.remoteAddress
//     const { success } = await ratelimit.limit(ip);
//     if (!success) {
//       return res.status(429).json({ message: "Too many requests" });
//     }
//     next();
//   } catch (error) {
//     console.error("Rate limit error", error);
//     next(); // Allow request if limiter fails
//   }
// };

// export default rateLimiter;



// // import { Ratelimit } from "@upstash/ratelimit";
// // import { Redis } from "@upstash/redis";

// // import dotenv from "dotenv";

// // dotenv.config();

// // // create a ratelimiter that allows 100 requests per minute
// // const ratelimit = new Ratelimit({
// //   // redis: Redis.fromEnv(),
// //   // limiter: Ratelimit.slidingWindow(100, "60 s"),
// // });

// // export default ratelimit;
