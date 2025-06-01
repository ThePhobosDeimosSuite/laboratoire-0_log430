import Manager from '../../controller/manager.js'
import appConst from "../../utils/app-const.js"
import { colorizeJSON } from "../../utils/output-utils.js"
import mainBusinessView from "./main-business-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit

interface StocksPerStore {
    storeId:number, 
    lowStockProduct: 
    {
        name:string, 
        amount:number
    }[]
}

export default async () => {
    terminal.clear()

    const allSalesPerStore = {}

    for(const storeId of appConst.storeShopId) {
        const sales = await Manager.searchSales(undefined, storeId)
        const totalSalesPrice = sales.reduce((partialsum, a) => partialsum + a.totalPrice, 0)
        allSalesPerStore[`Store ${storeId}`] = totalSalesPrice + " $"
    }

    terminal.cyan("TOTAL SALES PER STORE: ")
    colorizeJSON(allSalesPerStore)

    terminal.once('key', async () => {
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

        terminal.clear()
        terminal.red("LOW STOCK (below 5): \n")
        colorizeJSON(lowStocksPerStore)

        terminal.once('key', async () => {

            const highStocksPerStore: StocksPerStore[] = []

            for (const storeId of appConst.storeShopId) {
                const allProduct = await Manager.searchProduct(undefined, undefined, undefined, storeId)
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

            terminal.clear()

            terminal.green("HIGH STOCK (above 100): \n")
            colorizeJSON(highStocksPerStore)

            terminal.once('key', async () => {
                mainBusinessView()
            })
        })
     })

    // Total of all sales per store, stocks below 5, stocks above 75
}
