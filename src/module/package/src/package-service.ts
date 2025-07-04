import { Producer } from 'kafkajs'
import { Counter, Gauge } from 'prom-client'
import { kafka, packageState, waitForKafka } from 'shared-utils'


export default class PackageService {
    private eventCounter : Counter
    private eventTime : Gauge
    private producer: Producer
    constructor(eventCounter: Counter, eventTime: Gauge) {
        this.eventTime = eventTime
        this.eventCounter = eventCounter
        this.producer = kafka.producer()
    }

    async initializeKafka() {
        await this.producer.connect()
    }

    async sendPackageUpdate(packageId: number, state: packageState) {
        // Prometheus
        const now = Date.now() / 1000;
        this.eventCounter.labels(state).inc(1)
        this.eventTime.labels(state).set(now)
        
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