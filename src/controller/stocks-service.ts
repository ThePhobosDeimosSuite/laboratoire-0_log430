import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default class StocksService {

    static async addStocks(productId: number, amount: number, shopId: number) {
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

    static async getStocks(shopId: number, productId: number | undefined = undefined,
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
            include: {
                product: true
            }
        })
    }

    static async decrementStocks(productId: number, amount: number, shopId: number) {
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

    static async addOrder(productId: number, amount: number, shopId: number) {
        await prisma.order.create({
            data: {
                amount,
                shopId,
                productId
            }
        })
    }

    static async getOrder() {
        return await prisma.order.findMany({
            include: {
                product: true
            }
        })
    }

    static async removeOrder(productId: number, shopId: number) {
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
