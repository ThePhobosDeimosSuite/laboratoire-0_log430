import { headers } from "shared-utils";
import supplyCenterView from "./supply-center-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit

export default async () => {
    terminal.clear()

    const storeMenu = [1, 2, 3, 4, 5].map(id => `Store: ${id}`)
    terminal.singleColumnMenu(storeMenu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            supplyCenterView()
        } else {
            terminal.clear()
            terminal.yellow("Loading...")

            const selectedStore = response.selectedIndex + 1

            const url = new URL(process.env.KONG_URL)
            url.pathname = "/api/product"

            const productRes = await fetch(url.toString(), { headers: headers })
            const products = await productRes.json()

            url.pathname = `/api/store/${selectedStore}/stock`
            const stocksRes = await fetch(url.toString(), { headers: headers })
            const stocks = await stocksRes.json()

            const productWithStocks = []
            for (const product of products) {
                const stocksToAdd = stocks.find(s => s.productId == product.id)
                productWithStocks.push({ ...product, stock: stocksToAdd })
            }

            terminal.clear()
            terminal.yellow("List of product and stocks in this store (press enter to add 10 stocks, escape to cancel): ")
            const menu = productWithStocks.map(p => `${p.name} (Stock: ${p.stock?.amount ?? 0})`)

            terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
                if (response.canceled) {
                    supplyCenterView()
                } else {

                    const selectedProduct = productWithStocks[response.selectedIndex]

                    url.pathname = `/api/store/${selectedStore}/stock`
                    await fetch(url.toString(), {
                        method: 'POST',
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({
                            productId: selectedProduct.id,
                            amount: 10,
                            increment: true
                        })
                    })
                    supplyCenterView()
                }
            })
        }
    })
}