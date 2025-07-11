import { headers, askNumber, askInput } from "shared-utils";
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    const productSales: { productId: number, amount: number }[] = []

    async function createProductSales() {
        terminal.clear()
        terminal.yellow("Loading...")

        const url = new URL(process.env.KONG_URL)
        url.pathname = "/api/product"

        const productRes = await fetch(url.toString(), { headers: headers })
        const products = await productRes.json()

        url.pathname = `/api/store/${shopId}/stock`
        const stocksRes = await fetch(url.toString(), { headers: headers })
        const stocks = await stocksRes.json()

        const productWithStocks = []
        for (const stock of stocks) {
            const productToAdd = products.find(p => p.id == stock.productId)
            productWithStocks.push({ ...productToAdd, stock })
        }

        const menu = productWithStocks.map(p => `${p.name} (Stock: ${p.stock?.amount ?? 0})`)

        if (menu.length <= 0) {
            terminal.clear()
            terminal.red("No stocks in this store.")
            terminal.once('key', () => {
                businessView(shopId)
            })
        } else {
            terminal.clear()
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
                            await pushSales()
                        }
                    }
                }
            })
        }
    }

    async function pushSales() {
        terminal.yellow("\nLoading...")
        const url = new URL(process.env.KONG_URL)
        url.pathname = `/api/store/${shopId}/sales`

        await fetch(url.toString(), {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ productSales })
        })

        businessView(shopId)
    }

    createProductSales()
}