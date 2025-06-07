import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default class StoreEmployee {

    static async searchProduct(id: number | undefined = undefined,
        name: string | undefined = undefined,
        category: string | undefined = undefined,
        shopId: number | undefined = undefined,
        page: number | undefined = undefined,
        size: number | undefined = undefined) {
        return await prisma.product.findMany({
            where: {
                id,
                category,
                name
            },
            ...(size !== undefined &&
            {
                take: size
            }),
            ...(page !== undefined && size !== undefined &&
            {
                skip: (page - 1) * size,
            }),
            ...(shopId !== undefined && {
                include: {
                    stock: {
                        where: {
                            shopId
                        }
                    }
                }
            })
        })
    }

    static async createSales(productSales: { productId: number, amount: number }[], shopId: number) {
        // Reduce the stock after a sale
        for (const product of productSales) {
            await this.decrementStocks(product.productId, product.amount, shopId)
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

    static async searchSales(id: number | undefined, shopId: number,
        page: number | undefined = undefined,
        size: number | undefined = undefined
    ) {
        const sales = await prisma.sales.findMany({
            where: {
                id,
                shopId
            },
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
                    include: {
                        product: true
                    }
                }
            }
        })

        // Add total amount
        const response = sales.map(r => ({
            ...r,
            totalPrice: r.productSales
                .map(p => p.amount * p.product.price)
                .reduce((partialSum, a) => partialSum + a, 0)
        }))
        return response
    }

    static async cancelSales(id: number, shopId: number) {
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
         // Re-add stock???
        for(const productSale of sales.productSales) {
            await this.addStocks(productSale.productId, productSale.amount, shopId)
        }
    }

    protected static async addStocks(productId: number, amount: number, shopId: number) {
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
        size: number | undefined = undefined
    ) {
        return await prisma.stock.findMany({
            where: {
                productId,
                shopId
            },
            ...(size !== undefined &&
            {
                take: size
            }),
            ...(page !== undefined && size !== undefined &&
            {
                skip: (page - 1) * size,
            }),
            include: {
                product: true
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
}



