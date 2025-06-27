import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'service', 
    brokers: ['kafka:9092']
})

export const kafkaConst = {
    increaseStocks:"increaseStocks",
    decreaseStocks:"decreaseStocks"
}