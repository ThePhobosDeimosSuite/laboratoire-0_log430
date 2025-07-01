import { Consumer } from "kafkajs"
import { PrismaClient } from "../prisma/generated/prisma/client/client.js"
import { kafka, kafkaConst, waitForKafka } from 'shared-utils'
const prisma = new PrismaClient()



export default class StocksService {
    private consumer: Consumer
    constructor() {
        // this.consumer = kafka.consumer({groupId: 'service'})
    }

    // async initializeKafka() {
    //     await waitForKafka()
    //     await this.consumer.connect()
    //     await this.consumer.subscribe({ topic: kafkaConst.decreaseStocks, fromBeginning: false })
    //     await this.consumer.subscribe({ topic: kafkaConst.increaseStocks, fromBeginning: false })

    //     await this.consumer.run({
    //         eachMessage: async ({ topic, partition, message }) => {
    //             const data = JSON.parse(message.value.toString())

    //             switch (topic) {
    //                 case kafkaConst.decreaseStocks:
    //                     await this.decrementStocks(data.productId, data.amount, data.shopId)
    //                     break
    //                 case kafkaConst.increaseStocks:
    //                     await this.addStocks(data.productId, data.amount, data.shopId)
    //                     break
    //             }
    //         }
    //     })
    // }


    async addStocks(productId: number, amount: number, shopId: number) {
        await prisma.stock.upsert({
            where: {
                productId_shopId: {
                    productId,
                    shopId
                }
            },
            update: { // Increase stock if row already exists
                amount: {
                    increment: amount
                }
            },
            create: { // Create row if doesn't exist
                productId,
                amount,
                shopId
            }
        })
    }

    async getStocks(shopId: number, productId: number | undefined = undefined,
        page: number | undefined = undefined,
        size: number | undefined = undefined,
        sort: string[] | undefined = undefined,
    ) {
        return await prisma.stock.findMany({
            where: {
                productId,
                shopId
            },
            ...(sort != undefined && {
                orderBy: {
                    [sort[0]]: sort[1]
                }
            }),
            ...(size != undefined &&
            {
                take: size
            }),
            ...(page != undefined && size != undefined &&
            {
                skip: (page - 1) * size,
            }),
            // include: {
            //     product: true
            // }
        })
    }

    async decrementStocks(productId: number, amount: number, shopId: number) {
        await prisma.stock.updateMany({
            where: {
                shopId,
                productId
            },
            data: {
                amount: {
                    decrement: amount
                }
            }
        })
    }

    async incrementStocks(productId: number, amount: number, shopId: number) {
        await prisma.stock.updateMany({
            where: {
                shopId,
                productId
            },
            data: {
                amount: {
                    increment: amount
                }
            }
        })
    }

    async addOrder(productId: number, amount: number, shopId: number) {
        await prisma.order.create({
            data: {
                amount,
                shopId,
                productId
            }
        })
    }

    async getOrder(shopId: number) {
        return await prisma.order.findMany({
            where:{
                shopId
            }
            // include: {
            //     product: true
            // }
        })
    }

    async removeOrder(productId: number, shopId: number) {
        return await prisma.order.delete({
            where: {
                productId_shopId: {
                    productId,
                    shopId
                }
            }
        })
    }
}
