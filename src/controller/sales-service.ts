import { PrismaClient } from "@prisma/client"
import StocksService from "./stocks-service.js"
import appConst from "../utils/app-const.js"
import ProductService from "./product-service.js"
const prisma = new PrismaClient()

interface StocksPerStore {
    storeId: number,
    lowStockProduct:
    {
        name: string,
        amount: number
    }[]
}

export default class SalesService {

    static async getSalesReport(storeId: number) {
        const sales = await this.searchSales(undefined, storeId)

        const formatedSales = sales.map(s => ({
            isCancelled: s.isCancelled,
            salesPrice: s.totalPrice,
            productSold: s.productSales.map(p => ({
                name: p.product.name,
                price: p.product.price,
                amount: p.amount
            }))
        }))

        const totalSalesPrice = sales.reduce((partialsum, a) => partialsum + a.totalPrice, 0)

        const groupedProductSales = {}

        for (const sale of sales) {
            if (sale.isCancelled) continue

            for (const productSale of sale.productSales) {
                const { name } = productSale.product

                if (!groupedProductSales[name]) {
                    groupedProductSales[name] = productSale.amount
                } else {
                    groupedProductSales[name] += productSale.amount
                }
            }
        }

        const stocks = await StocksService.getStocks(storeId)
        const formatedStocks = stocks.map(s => ({
            amount: s.amount,
            name: s.product.name
        }))

        return {
            sales: formatedSales,
            totalSalesPrice,
            mostSoldProduct: groupedProductSales,
            stocks: formatedStocks
        }
    }

    static async createSales(productSales: { productId: number, amount: number }[], shopId: number) {
        // Reduce the stock after a sale
        for (const product of productSales) {
            await StocksService.decrementStocks(product.productId, product.amount, shopId)
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
        // Re-add stock
        for (const productSale of sales.productSales) {
            await StocksService.addStocks(productSale.productId, productSale.amount, shopId)
        }
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

    static async getDashboardView() {
        const allSalesPerStore = {}

        for (const storeId of appConst.storeShopId) {
            const sales = await this.searchSales(undefined, storeId)
            const totalSalesPrice = sales.reduce((partialsum, a) => partialsum + a.totalPrice, 0)
            allSalesPerStore[`Store ${storeId}`] = totalSalesPrice + " $"
        }

        const lowStocksPerStore: StocksPerStore[] = []

        for (const storeId of appConst.storeShopId) {
            const allProduct = await ProductService.searchProduct(undefined, undefined, undefined, storeId)
            const lowStockProduct = allProduct
                .filter(p => p.stock.length == 0 || p.stock[0]?.amount <= 5)
                .map(p => ({ name: p.name, amount: p.stock[0]?.amount ?? 0 }))
            if (lowStockProduct.length > 0) {
                lowStocksPerStore.push({
                    storeId,
                    lowStockProduct
                })
            }
        }

        const highStocksPerStore: StocksPerStore[] = []

        for (const storeId of appConst.storeShopId) {
            const allProduct = await ProductService.searchProduct(undefined, undefined, undefined, storeId)
            const highStockProduct = allProduct
                .filter(p => p.stock.length > 0 && p.stock[0].amount >= 100)
                .map(p => ({ name: p.name, amount: p.stock[0]?.amount ?? 0 }))
            if (highStockProduct.length > 0) {
                highStocksPerStore.push({
                    storeId,
                    lowStockProduct: highStockProduct
                })
            }
        }


        return {
            allSalesPerStore,
            lowStocksPerStore,
            highStocksPerStore
        }
    }
}