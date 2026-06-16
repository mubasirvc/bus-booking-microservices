// import { redisClient } from '@bus-booking/common';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedisClient } from '@bus-booking/common';

export const apiRateLimiter = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,

    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
      sendCommand: (...args: string[]) => getRedisClient().call(args[0], ...args.slice(1)),
    }),

    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
  });

// export const loginRateLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 min
//   max: 5,

//   store: new RedisStore({
//     sendCommand: (...args: string[]) => getRedisClient().call(args[0], ...args.slice(1)),
//   }),
// });

// export const paymentRateLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 min
//   max: 5,

//   store: new RedisStore({
//     sendCommand: (...args: string[]) => getRedisClient().call(args[0], ...args.slice(1)),
//   }),
// });
