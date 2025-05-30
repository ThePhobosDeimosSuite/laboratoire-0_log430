import StoreEmployee from "./store-employee";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default class SupplyCenterEmployee extends StoreEmployee {
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