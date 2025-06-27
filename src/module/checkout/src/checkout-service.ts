import { Producer } from "kafkajs"
import { kafka, kafkaConst, waitForKafka } from "shared-utils"


export default class CheckoutService {
    private producer: Producer
    constructor() {
        this.producer = kafka.producer()
    }

    async initializeKafka() {
        await waitForKafka()
        await this.producer.connect()
    }

    async checkoutSale(shopId: number, clientId: number) {
        await this.producer.send({
            topic: kafkaConst.checkoutSale,
            messages: [
                {
                    value: JSON.stringify({ shopId, clientId }),
                }
            ]
        })
    }
}
