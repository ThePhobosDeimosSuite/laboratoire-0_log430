import { PrismaClient } from "../prisma/generated/prisma/client/client.js"
import appConst from "../../../shared-utils/app-const.js"
const prisma = new PrismaClient()


export default class SalesService {

    static async createSales(productSales: { productId: number, amount: number }[], shopId: number) {
        // Reduce the stock after a sale
        for (const product of productSales) {
            // TODO kafka or something??
            // await StocksService.decrementStocks(product.productId, product.amount, shopId)
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
        const response = sales.map(r => ({
            ...r,
            totalPrice: r.productSales
                .map(p => p.amount * p.product.price)
                .reduce((partialSum, a) => partialSum + a, 0)
        }))
        return response
    }
}