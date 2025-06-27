import { Producer } from "kafkajs"
import { PrismaClient } from "../prisma/generated/prisma/client/client.js"
import { kafka, kafkaConst } from 'shared-utils'

const dbURL = process.env.DATABASE_URL || "postgresql://postgres:123@localhost:5434/sales"
const prisma = new PrismaClient({
 datasources: {
    db: {
      url: dbURL
    },
  },
})

export default class SalesService {
    private producer: Producer
    constructor() {
        this.producer = kafka.producer()
    }

    async initializeKafka() {
        await this.producer.connect()
    }

    async createSales(productSales: { productId: number, amount: number }[], shopId: number) {
        // Reduce the stock after a sale, sending to stocks service using kafka
        for (const product of productSales) {
            await this.producer.send({
                topic: kafkaConst.decreaseStocks,
                messages: [
                    {
                        value: JSON.stringify({productId: product.productId, amount: product.amount, shopId}),
                    }
                ]
           })
        }

        await prisma.sales.create({
            data: {
                productSales: {
                    create: productSales
                },
                shopId
            }
        })
    }

    async searchSales(id: number | undefined, shopId: number,
        page: number | undefined = undefined,
        size: number | undefined = undefined,
        sort: string[] | undefined = undefined
    ) {
        const sales = await prisma.sales.findMany({
            where: {
                id,
                shopId
            },
            ...(sort != undefined && {
                orderBy: {
                    [sort[0]]: sort[1]
                }
            }),
            ...(size !== undefined &&
            {
                take: size
            }),
            ...(page !== undefined && size !== undefined &&
            {
                skip: (page - 1) * size,
            }),
            include: {
                productSales: {
                    // include: {
                    //     product: true
                    // }
                }
            }
        })

        // Add total amount
        // const response = sales.map(r => ({
            // ...r,
            // totalPrice: r.productSales
            //     .map(p => p.amount * p.product.price) // TODO query product to get sales price
            //     .reduce((partialSum, a) => partialSum + a, 0)
        // }))
        return sales
    }

    async cancelSales(id: number, shopId: number) {
        const sales = await prisma.sales.update({
            where: {
                id,
                shopId
            },
            data: {
                isCancelled: true
            },
            include: {
                productSales: true
            }
        })

        // // Re-add stock
        for (const productSale of sales.productSales) {
            await this.producer.send({
                topic: kafkaConst.increaseStocks,
                messages: [
                    {
                        value: JSON.stringify({productId: productSale.productId, amount: productSale.amount, shopId}),
                    }
                ]
           })
        }
    }
}