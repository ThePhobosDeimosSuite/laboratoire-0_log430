import { Consumer } from "kafkajs";
import { kafka, packageState } from "shared-utils/kafka.js";


export class EventStoreService {
    private consumer: Consumer
    constructor() {
        this.consumer = kafka.consumer({groupId: 'event-store'})
    }

    async initializeKafka() {
        await this.consumer.connect()
        await this.consumer.subscribe({topics: Object.values(packageState) })
        await this.consumer.run({
            eachMessage: async  ({topic, partition, message}) => {
                
            }
        })
    }

    async registerEvent(id: number, status: packageState) {

    }

    async getPackageStatus(id: number) {

    }
}