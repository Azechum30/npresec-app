import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";


export const rateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    prefix: "@upstash/ratelimit",
    analytics: true
})
