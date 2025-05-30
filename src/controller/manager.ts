import { PrismaClient } from '@prisma/client'
import SupplyCenterEmployee from './supply-center-employee'
const prisma = new PrismaClient()

export default class Manager extends SupplyCenterEmployee {
    static async addProduct(name: string, price: number, category: string) {
        await prisma.product.create({
            data: {
                name,
                price,
                category
            }
        })
    }

    static async updateProduct(id: number, name: string, price: number, category: string) {
        await prisma.product.update({
            where: {
                id
            },
            data: {
                name,
                price,
                category
            }
        })
    }
}