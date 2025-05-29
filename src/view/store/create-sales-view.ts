var term = require( 'terminal-kit' ).terminal
import { askInput, askNumber } from "../../utils/input-utils"
import { createSales } from "../../controller/controller"
import businessView from "./store-view"

var term = require( 'terminal-kit' ).terminal


export default async (shopId: number) => {
    const productSales: {productId: number, amount: number}[] = []

    async function createProductSales() {
        term.clear()
        const productId = await askNumber("Enter product id:")
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

    async function pushSales() {
        createSales(productSales, shopId)
        businessView(shopId)
    }

    createProductSales()
}