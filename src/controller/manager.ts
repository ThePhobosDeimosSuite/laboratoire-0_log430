import { PrismaClient } from "@prisma/client"
import SupplyCenterEmployee from './supply-center-employee.js'
import appConst from "../utils/app-const.js"
const prisma = new PrismaClient()

interface StocksPerStore {
    storeId:number, 
    lowStockProduct: 
    {
        name:string, 
        amount:number
    }[]
}

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

        const stocks = await this.getStocks(storeId)
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

    static async getDashboardView() {
        const allSalesPerStore = {}

        for (const storeId of appConst.storeShopId) {
            const sales = await this.searchSales(undefined, storeId)
            const totalSalesPrice = sales.reduce((partialsum, a) => partialsum + a.totalPrice, 0)
            allSalesPerStore[`Store ${storeId}`] = totalSalesPrice + " $"
        }

        const lowStocksPerStore: StocksPerStore[] = []

        for (const storeId of appConst.storeShopId) {
            const allProduct = await Manager.searchProduct(undefined, undefined, undefined, storeId)
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
            const allProduct = await Manager.searchProduct(undefined, undefined, undefined, storeId)
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