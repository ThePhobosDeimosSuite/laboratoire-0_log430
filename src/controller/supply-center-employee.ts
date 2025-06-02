import { PrismaClient } from "@prisma/client"
import StoreEmployee from "./store-employee";

const prisma = new PrismaClient()

export default class SupplyCenterEmployee extends StoreEmployee {

    static async addStocks(productId: number, amount: number, shopId: number) {
        await super.addStocks(productId, amount, shopId)
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