import { addOrder, getStocks, searchProduct } from "../../controller/controller"
import { askNumber, askString } from "../../utils/input-utils"
import storeView from "./store-view"
import appConst from "../../utils/app-const"

var term = require( 'terminal-kit' ).terminal

export default async (shopId: number) => {
    term.clear()

    // Get all products
    const products = await searchProduct(undefined, undefined, undefined, shopId)

    const menu = products.map(p => `${p.name} (stock: ${p.stock[0]?.amount ?? 0})`)
    term.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            storeView(shopId)
        } else {
            const selectedProduct = products[response.selectedIndex]

            const stocksInSupplyCenter = await getStocks(appConst.supplyCenterShopId, selectedProduct.id)
            term.clear()
            term.red(`The supply center has (${stocksInSupplyCenter[0]?.amount ?? 0}) ${selectedProduct.name}\n`)
            const amount = await askNumber(`How many ${selectedProduct.name} do you want to order?: `)

            addOrder(selectedProduct.id, amount, shopId)

            term.clear()
            term.green("Order placed!")
            term.once('key', () => {
                storeView(shopId)
            })
        }

    })
}