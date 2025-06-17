import ProductService from "../../controller/product-service.js";
import SalesService from "../../controller/sales-service.js";
import { askInput, askNumber } from "../../utils/input-utils.js"
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    const productSales: {productId: number, amount: number}[] = []

    async function createProductSales() {
        terminal.clear()

        const products = await ProductService.searchProduct(undefined, undefined, undefined, shopId)
        const menu = products.map(p => `${p.name} (Stock: ${p.stock[0]?.amount ?? 0})`)
        
        terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
            if (response.canceled) {
                businessView(shopId)
            } else {

                terminal.clear()
                const productId = products[response.selectedIndex].id
                const amount = await askNumber("\nEnter quantity sold:")

                if (productId == 0 || amount == 0) {
                    terminal.red("Invalid input!")
                    terminal.once('key', () => {
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
        SalesService.createSales(productSales, shopId)
        businessView(shopId)
    }

    createProductSales()
}