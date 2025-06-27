import { Consumer, Producer } from "kafkajs"
import { PrismaClient } from "../prisma/generated/prisma/client/client.js"
import { kafka, kafkaConst, waitForKafka } from 'shared-utils'

const dbURL = process.env.DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbURL
    },
  },
})

export default class ShoppingCartService {
  private producer: Producer;    
  private consumer: Consumer
  constructor() {
    this.producer = kafka.producer()
    this.consumer = kafka.consumer({groupId: 'service'})
  }

  async initializeKafka() {
    await waitForKafka()
    await this.producer.connect()

    await this.consumer.connect()
    await this.consumer.subscribe({ topic: kafkaConst.checkoutSale, fromBeginning: false })

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString())

        await this.clearCart(data.shopId, data.clientId)
      }
    })
  }
  async addItemsToCart(productSales: { productId: number, amount: number }[], shopId: number, clientId: number) {
    await prisma.sales.create({
      data: {
        productSales: {
          create: productSales
        },
        shopId,
        clientId
      }
    })
  }

  async getCart(shopId: number, clientId: number) {
    const cart = await prisma.sales.findUnique({
      where: {
        shopId_clientId:{
          shopId,
          clientId
        }
      },
    })

    return cart
  }

  async clearCart(shopId: number, clientId: number) {
    console.log("ClearCart")
    console.log(`storeId: ${shopId} clientId :${clientId}`)
    const deletedSale = await prisma.sales.delete({
      where: {
        shopId_clientId:{
          shopId,
          clientId
        }
      },
      include: {
        productSales: true
      }
    })

    // Delete stock 
    for (const productSale of deletedSale.productSales) {
      await this.producer.send({
        topic: kafkaConst.decreaseStocks,
        messages: [
          {
            value: JSON.stringify({ productId: productSale.productId, amount: productSale.amount, shopId }),
          }
        ]
      })
    }
  }
}