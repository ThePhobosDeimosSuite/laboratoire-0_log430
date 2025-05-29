import { searchProduct, searchSales } from "../../controller/controller"
import appConst from "../../utils/app-const"
import { colorizeJSON } from "../../utils/output-utils"
import mainBusinessView from "./main-business-view"

var term = require( 'terminal-kit' ).terminal

interface StocksPerStore {
    storeId:number, 
    lowStockProduct: 
    {
        name:string, 
        amount:number
    }[]
}

export default async () => {
    term.clear()

    const allSalesPerStore = {}

    for(const storeId of appConst.storeShopId) {
        const sales = await searchSales(undefined, storeId)
        const totalSalesPrice = sales.reduce((partialsum, a) => partialsum + a.totalPrice, 0)
        allSalesPerStore[`Store ${storeId}`] = totalSalesPrice + " $"
    }

    term.cyan("TOTAL SALES PER STORE: ")
    colorizeJSON(allSalesPerStore)

    term.once('key', async () => {
        const lowStocksPerStore: StocksPerStore[] = []

        for (const storeId of appConst.storeShopId) {
            const allProduct = await searchProduct(undefined, undefined, undefined, storeId)
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

        term.clear()
        term.red("LOW STOCK (below 5): \n")
        colorizeJSON(lowStocksPerStore)

        term.once('key', async () => {

            const highStocksPerStore: StocksPerStore[] = []

            for (const storeId of appConst.storeShopId) {
                const allProduct = await searchProduct(undefined, undefined, undefined, storeId)
                const highStockProduct = allProduct
                    .filter(p => p.stock.length > 0 && p.stock[0].amount >= 100)
                    .map(p => ({ name: p.name, amount: p.stock[0]?.amount ?? 0 }))
                if(highStockProduct.length > 0) {
                    highStocksPerStore.push({
                        storeId,
                        lowStockProduct: highStockProduct
                    })
                }
            }

            term.clear()

            term.green("HIGH STOCK (above 100): \n")
            colorizeJSON(highStocksPerStore)

            term.once('key', async () => {
                mainBusinessView()
            })
        })
     })

    // Total of all sales per store, stocks below 5, stocks above 75
}
