import { Redis } from 'ioredis';
require('dotenv').config();

let redisInstance: Redis | null = null;

const redisClient = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    throw new Error("Redis connection failed: REDIS_URL not found in .env");
};

const getRedisInstance = (): Redis => {
    if (!redisInstance) {
        redisInstance = new Redis(redisClient(), {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            retryStrategy: (times) => {
                if (times > 3) {
                    console.error('Redis max retry attempts reached');
                    return null;
                }
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            reconnectOnError: (err) => {
                const targetError = 'READONLY';
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            },
            lazyConnect: false,
            keepAlive: 30000,
            connectTimeout: 10000,
            commandTimeout: 5000,
        });

        let isConnected = false;

        redisInstance.on('connect', () => {
            if (!isConnected) {
                console.log("Redis connected successfully to Upstash!");
                isConnected = true;
            }
        });

        redisInstance.on('error', (err: any) => {
            if (err.message.includes('ECONNRESET') || err.message.includes('ETIMEDOUT')) {
                return;
            }
            console.log("Redis connection error: ", err.message);
        });

        redisInstance.on('close', () => {
            isConnected = false;
        });
    }

    return redisInstance;
};

export const redis = getRedisInstance();