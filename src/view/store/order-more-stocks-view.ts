import { addStocks, searchProduct } from "../../controller/controller"
import { askNumber, askString } from "../../utils/input-utils"
import storeView from "./store-view"

var term = require( 'terminal-kit' ).terminal

export default async (shopId: number) => {
    term.clear()

    // Get all products
    const products = await searchProduct(undefined, undefined, undefined, shopId)

    const menu = products.map(p => `${p.name} (stock: ${p.stock[0]?.amount ?? 0})`)
    term.singleColumnMenu(menu,  { cancelable: true }, async (error, response) => {
        const selectedProduct = products[response.selectedIndex]

        term.clear()
        const amount = await askNumber(`How many ${selectedProduct.name} do you want to order?: `)

        addStocks(selectedProduct.id, amount, -1) // -1 means the supply-center

        storeView(shopId)
    })
}