import { kafka, waitForKafka, packageState, logger } from 'shared-utils'

const consumer = kafka.consumer({groupId: 'email'})
await waitForKafka()
await consumer.connect()
await consumer.subscribe({topics: Object.values(packageState)})

await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
        logger.info(`Sending email to user for package ${message.value.toString()}, state updated to ${topic}`)
    }
})
