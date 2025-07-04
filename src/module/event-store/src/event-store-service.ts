import { Consumer } from "kafkajs";
import { packageEvent, PrismaClient } from "../prisma/generated/prisma/client/client.js"
import { kafka, packageState, waitForKafka } from "shared-utils";
import { getRedis, setRedis } from "./redis.js";
import { Counter, Gauge } from "prom-client";

const dbURL = process.env.DATABASE_URL
const prisma = new PrismaClient({
 datasources: {
    db: {
      url: dbURL
    },
  },
})

export class EventStoreService {
    private consumer: Consumer
    private eventTime: Gauge
    private eventCounter: Counter
    constructor(eventCounter: Counter, eventTime: Gauge) {
        this.eventCounter = eventCounter
        this.eventTime = eventTime
        
        this.consumer = kafka.consumer({groupId: 'event-store'})

        this.initializeRedis().then(() => {
            this.initializeKafka().then()
        })
    }

    async initializeRedis() {
        const values = await this.replay()
        for (const value of Object.values(values)) {
            await setRedis(value.packageId.toString(), value.state)
        }
    }

    async initializeKafka() {
        await waitForKafka()
        await this.consumer.connect()
        await this.consumer.subscribe({topics: Object.values(packageState) })
        await this.consumer.run({
            eachMessage: async  ({topic, partition, message}) => {
                await this.registerEvent(Number(message.value), topic as packageState)
            }
        })
    }

    async registerEvent(packageId: number, state: packageState) {
        // Prometheus
        const now = Date.now() / 1000;
        this.eventCounter.labels(state).inc(1)
        this.eventTime.labels(state).set(now)

        await prisma.packageEvent.create({
            data:{
                packageId,
                state
            }
        })

        // Update redis
        await setRedis(packageId.toString(), state)
    }

    async replay() {
        const packageEvents = await prisma.packageEvent.findMany()

        return packageEvents.reduce<Record<string,packageEvent>>((acc, item) => {
            const existing = acc[item.packageId]
            if(!existing || new Date(existing.date).getTime() < new Date(item.date).getTime() ) {
                acc[item.packageId] = item
            }
            
            return acc
        }, {})
    }

    async getPackageStatus(id: number) {
        return await getRedis(id.toString())
    }
}