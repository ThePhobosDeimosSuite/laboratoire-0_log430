import { createClient } from "redis";
import { logger } from "shared-utils";

let redisClient
async function initializeRedisConnection(redisURL: string) {
    redisClient = createClient({url: redisURL, }).on("error", (e) => {
        logger.error("Can't connect to Redis ")
        logger.error(e)
        redisClient.destroy()
        redisClient = undefined
    })
    await redisClient.connect()
    if(redisClient != undefined) {
        logger.info("Redis connected!")
    }
}

export async function setRedis(key:string, value: string) {
    if(!redisClient) {
        await initializeRedisConnection(process.env.REDIS_URL)
    }
    redisClient.set(key, value)
}

export async function getRedis(key: string) {
    if(!redisClient) {
        await initializeRedisConnection(process.env.REDIS_URL)
    }
    return await redisClient.get(key)
}

