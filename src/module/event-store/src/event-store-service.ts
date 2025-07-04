import { Consumer } from "kafkajs";
import { packageEvent, PrismaClient } from "../prisma/generated/prisma/client/client.js"
import { logger, kafka, packageState, waitForKafka } from "shared-utils";

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
    constructor() {
        this.consumer = kafka.consumer({groupId: 'event-store'})

        // TODO initializeRedis
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
        await prisma.packageEvent.create({
            data:{
                packageId,
                state
            }
        })

        // TODO send to redis
    }

    async replay() {
        const packageEvents = await prisma.packageEvent.findMany()

        const test = packageEvents.reduce<Record<string,packageEvent>>((acc, item) => {
            const existing = acc[item.packageId]
            if(!existing || new Date(existing.date).getTime() < new Date(item.date).getTime() ) {
                acc[item.packageId] = item
            }
            
            return acc
        }, {})


        console.log(test)
        return test
    }

    async getPackageStatus(id: number) {
        return await this.replay()
    }
}