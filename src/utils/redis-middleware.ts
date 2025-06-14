import { Request, Response, NextFunction, Send } from 'express'
import winston from 'winston';
import { createClient } from 'redis';

// Logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});
let redisClient = undefined

export async function initializeRedisConnection(redisURL: string) {
    redisClient = createClient({url: redisURL}).on("error", (e) => {
        logger.error("Can't connect to Redis")
        logger.error(e)
    })

    await redisClient.connect()
    logger.info("Redis connected!")
}

// Cache sales and stocks
export default async (req: Request, res: Response, next: NextFunction) => {
    // TODO update diagrams

    // Clear cache when post request
    if(req.method == "POST") {
        const { id } = req.params

        for await (const keys of redisClient.scanIterator({
            TYPE: "string",
            MATCH: `*${id}*`,
            COUNT: 500
        })) {
            for(const key of keys) {
                redisClient.del(key)
                logger.info(`Deleting Redis key: ${key}`)
            }
        }
        next()
        return
    }

    const cachedData = await redisClient.get(req.url)

    if(cachedData) {
        logger.info(`Data taken from cache : ${req.url}`)
        res.send(JSON.parse(cachedData))
        return
    } else {
        const oldSend = res.send

        res.send = (data): Response<any, Record<string, any>> => {
            res.send = oldSend
            if (res.statusCode.toString().startsWith("2")) {
                logger.info(`New data saved to cache : ${req.url}`)
                redisClient.set(req.url, data, 
                    {
                        EX:21600 // Save cache for 6h
                    })
            }
            return res.send(data)
        }

        next()
    }
}