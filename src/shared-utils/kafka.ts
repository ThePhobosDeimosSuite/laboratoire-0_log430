import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'service', 
    brokers: ['kafka:9092']
})

export const kafkaConst = {
    increaseStocks:"increaseStocks",
    decreaseStocks:"decreaseStocks",
    checkoutSale:"checkoutSale"
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForKafka() {
    const admin = kafka.admin()
    let retries = 10

    while (retries--) {
        try {
      await admin.connect()
      await admin.disconnect()
      console.log('Kafka is ready!')
      return
    } catch (err) {
      console.log('Waiting for Kafka...')
      await delay(5000)
    }
  }

  throw new Error('Kafka did not become ready in time')
}