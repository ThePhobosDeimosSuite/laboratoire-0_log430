import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'service', 
    brokers: ['kafka:9092'],
    retry: {
      initialRetryTime: 700,
      retries: 10,
      maxRetryTime: 10000
    }
})

export enum packageState {
  LabelCreated = "LabelCreated",
  PackageSent = "PackageSent",
  OutForDelivery = "OutForDelivery",
  Delivered = "Delivered",
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForKafka() {
      await delay(5000)
}