import { Redis } from 'ioredis';
require('dotenv').config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    throw new Error("Redis connection failed: REDIS_URL not found in .env");
};

export const redis = new Redis(redisClient(), {
    maxRetriesPerRequest: null, 
    enableReadyCheck: false,  
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true; 
        }
        return false;
    },
});

redis.on('connect', () => {
    console.log("Redis connected successfully to Upstash!");
});

redis.on('error', (err: any) => {
    console.log("Redis connection error: ", err.message);
});