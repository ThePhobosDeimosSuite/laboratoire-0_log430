import { Consumer, Producer } from "kafkajs"
import { PrismaClient } from "../prisma/generated/prisma/client/client.js"
import { kafka, logger, PackageKafkaTopic, PackageMessage } from "shared-utils"

const prisma = new PrismaClient()

export default class StocksService {
    private consumer: Consumer
    private producer: Producer
    constructor() {
        this.producer = kafka.producer()
        this.consumer = kafka.consumer({groupId: 'stocks'})
    }

    async initializeKafka() {
        await this.producer.connect()
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: PackageKafkaTopic.PackageOrderReceived, fromBeginning: false })

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value.toString()) as PackageMessage
                await this.removeStocksFromPackage(data)
            }
        })
    }


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

    async removeStocksFromPackage(packageMessage: PackageMessage) {
        let failed = false;
        const { storeId, productSales } = packageMessage
        console.log(storeId)
        
        // Check stocks
        for(const productSale of productSales) {
            const stocks = await this.getStocks(storeId, productSale.productId)
            const stock = stocks.find(s => s.productId == productSale.productId)

            if (!stock || stock.amount < productSale.amount) {
                failed = true
                logger.info(`Sending event ${PackageKafkaTopic.PackageError}`)
                await this.producer.send({
                    topic: PackageKafkaTopic.PackageError, messages: [
                        {
                            value: JSON.stringify(packageMessage)
                        }
                    ]
                })
                break;
            }
        }

        if (!failed) {
            // Remove stocks 
            for(const productSale of productSales) {
                await this.decrementStocks(productSale.productId, productSale.amount, storeId)
            }
            logger.info(`Sending event ${PackageKafkaTopic.PackageStocksRemoved}`)
            await this.producer.send({
                topic: PackageKafkaTopic.PackageStocksRemoved, messages: [
                    {
                        value: JSON.stringify(packageMessage)
                    }
                ]
            })
        }
    }
}
