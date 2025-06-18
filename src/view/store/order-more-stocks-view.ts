import { askNumber } from "../../shared-utils/input-utils.js"
import storeView from "./store-view.js"
import appConst from "../../shared-utils/app-const.js"
import terminalKit from "terminal-kit";
import ProductService from "../../controller/product-service.js";
import StocksService from "../../controller/stocks-service.js";
const { terminal } = terminalKit

export default async (shopId: number) => {
    terminal.clear()

    // Get all products
    const products = await ProductService.searchProduct(undefined, undefined, undefined, shopId)

    const menu = products.map(p => `${p.name} (stock: ${p.stock[0]?.amount ?? 0})`)
    terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            storeView(shopId)
        } else {
            const selectedProduct = products[response.selectedIndex]

            const stocksInSupplyCenter = await StocksService.getStocks(appConst.supplyCenterShopId, selectedProduct.id)
            terminal.clear()
            terminal.red(`The supply center has (${stocksInSupplyCenter[0]?.amount ?? 0}) ${selectedProduct.name}\n`)
            const amount = await askNumber(`How many ${selectedProduct.name} do you want to order?: `)

            StocksService.addOrder(selectedProduct.id, amount, shopId)

            terminal.clear()
            terminal.green("Order placed!")
            terminal.once('key', () => {
                storeView(shopId)
            })
        }

    })
}