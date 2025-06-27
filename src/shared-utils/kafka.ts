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
      await delay(10000)
}