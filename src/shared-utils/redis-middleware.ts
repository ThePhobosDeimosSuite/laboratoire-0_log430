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

export async function cacheSales(req: Request, res: Response, next: NextFunction) {
    await handleCacheRequest("sales", req, res, next)
}

export async function cacheStocks(req: Request, res: Response, next: NextFunction) {
    await handleCacheRequest("stocks", req, res, next)
}

async function handleCacheRequest(objectType:string ,req: Request, res: Response, next: NextFunction) {
    if(redisClient == undefined) {
        next()
        return
    }

    // Clear cache when post request
    if(req.method == "POST") {
        const { id } = req.params

        for await (const keys of redisClient.scanIterator({
            TYPE: "string",
            MATCH: `${objectType}*${id}*`,
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

    getCacheData(`${objectType}:${req.url}`, res, next)
}


async function getCacheData (url: string, res: Response, next: NextFunction) {

    const cachedData = await redisClient.get(url)

    if(cachedData) {
        logger.info(`Data taken from cache : ${url}`)
        res.send(JSON.parse(cachedData))
        return
    } else {
        const oldSend = res.send

        res.send = (data): Response<any, Record<string, any>> => {
            res.send = oldSend
            if (res.statusCode.toString().startsWith("2")) {
                logger.info(`New data saved to cache : ${url}`)
                redisClient.set(url, data, 
                    {
                        EX:21600 // Save cache for 6h
                    })
            }
            return res.send(data)
        }

        next()
    }
}