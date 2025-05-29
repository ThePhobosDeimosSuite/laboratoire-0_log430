var term = require( 'terminal-kit' ).terminal
import { askInput, askNumber } from "../../utils/input-utils"
import { createSales, searchProduct } from "../../controller/controller"
import businessView from "./store-view"

var term = require( 'terminal-kit' ).terminal


export default async (shopId: number) => {
    const productSales: {productId: number, amount: number}[] = []

    async function createProductSales() {
        term.clear()

        const products = await searchProduct(undefined, undefined, undefined, shopId)
        const menu = products.map(p => `${p.name} (Stock: ${p.stock[0]?.amount ?? 0})`)
        
        term.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
            if (response.canceled) {
                businessView(shopId)
            } else {

                term.clear()
                const productId = products[response.selectedIndex].id
                const amount = await askNumber("\nEnter quantity sold:")

                if (productId == 0 || amount == 0) {
                    term.red("Invalid input!")
                    term.once('key', () => {
                        businessView(shopId)
                        return
                    })
                } else {
                    productSales.push({
                        productId,
                        amount
                    })

                    const res = await askInput("\n Add more product ? (yes/no):")
                    if (res == "yes") {
                        await createProductSales()
                    } else {
                        pushSales()
                    }
                }
            }
        })
    }

    async function pushSales() {
        createSales(productSales, shopId)
        businessView(shopId)
    }

    createProductSales()
}