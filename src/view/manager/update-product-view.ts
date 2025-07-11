
import { askNumber, askString, headers } from "shared-utils";
import mainBusinessView from "./main-business-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit

export default async () => {
    terminal.clear()
    
    const productUrl = new URL(process.env.KONG_URL)
    productUrl.pathname = "/api/product"

    const productRes = await fetch(productUrl.toString(), { headers: headers })
    const products = await productRes.json()

    const menu = products.map(p => `Id: ${p.id}, Name: ${p.name}, Price: ${p.price}, Category: ${p.category}`)

    terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            mainBusinessView()
        } else {
            const selectedProduct = products[response.selectedIndex]
            terminal.clear()
            const name = await askString("\nEnter product name: ", selectedProduct.name)
            const price = await askNumber("\nEnter product price: ", selectedProduct.price.toString())
            const category = await askString("\nEnter category: ", selectedProduct.category)

            productUrl.pathname = "/api/product/" + selectedProduct.id

            await fetch(productUrl.toString(), {
                method: 'PUT',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    price,
                    category
                })
            })

            terminal.clear()
            terminal.green(`Product updated: \nId:${selectedProduct.id}\nName: ${name}\nPrice: ${price}\nCategory: ${category}`)
            terminal.once('key', () => {
                mainBusinessView()
            })
        }
    }
)

}