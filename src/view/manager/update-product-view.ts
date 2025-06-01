import Manager from '../../controller/manager.js'
import { askNumber, askString } from "../../utils/input-utils.js"
import mainBusinessView from "./main-business-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit

export default async () => {
    terminal.clear()
    const products = await Manager.searchProduct()
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

            Manager.updateProduct(selectedProduct.id, name, price, category)

            terminal.clear()
            terminal.green(`Product updated: \nId:${selectedProduct.id}\nName: ${name}\nPrice: ${price}\nCategory: ${category}`)
            terminal.once('key', () => {
                mainBusinessView()
            })
        }
    }
)

}