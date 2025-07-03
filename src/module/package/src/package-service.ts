import { Producer } from 'kafkajs'
import { kafka, packageState, waitForKafka } from 'shared-utils'


export default class PackageService {
    private producer: Producer
    constructor() {
        this.producer = kafka.producer()
    }

    async initializeKafka() {
        await waitForKafka()
        await this.producer.connect()
    }

    async sendPackageUpdate(packageId: number, state: packageState) {
        await this.producer.send({
            topic: state.toString(),
            messages: [
                {
                    value: packageId.toString()
                }
            ]
        })
    }

}