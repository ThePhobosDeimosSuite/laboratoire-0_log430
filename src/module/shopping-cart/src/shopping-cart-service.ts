import { PrismaClient } from "../prisma/generated/prisma/client/client.js"

const dbURL = process.env.DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbURL
    },
  },
})

export default class ShoppingCartService {
  constructor() {
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
        shopId_clientId: {
          shopId,
          clientId
        },
      },
      include: {
        productSales: true
      }
    })

    return cart
  }

  async deleteCart(shopId: number, clientId: number) {
    // NOT USED ANYMORE WITH SCÉNARIO MÉTIER
    // const deletedSale = await prisma.sales.findUnique({
    //   where: {
    //     shopId_clientId: {
    //       shopId,
    //       clientId
    //     },
    //   },
    //   include: {
    //     productSales: true
    //   }
    // })
    await prisma.sales.delete({
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
    // NOT USED ANYMORE WITH SCÉNARIO MÉTIER
    // for (const productSale of deletedSale.productSales) {
    //   await this.producer.send({
    //     topic: kafkaConst.decreaseStocks,
    //     messages: [
    //       {
    //         value: JSON.stringify({ productId: productSale.productId, amount: productSale.amount, shopId }),
    //       }
    //     ]
    //   })
    // }
  }
}