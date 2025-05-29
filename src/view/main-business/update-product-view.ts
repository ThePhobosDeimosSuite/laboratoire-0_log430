import { searchProduct, updateProduct } from "../../controller/controller"
import { askNumber, askString } from "../../utils/input-utils"
import mainBusinessView from "./main-business-view"

var term = require( 'terminal-kit' ).terminal

export default async () => {
    term.clear()
    const products = await searchProduct()
    const menu = products.map(p => `Id: ${p.id}, Name: ${p.name}, Price: ${p.price}, Category: ${p.category}`)

    term.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            mainBusinessView()
        } else {
            const selectedProduct = products[response.selectedIndex]
            term.clear()
            const name = await askString("\nEnter product name: ", selectedProduct.name)
            const price = await askNumber("\nEnter product price: ", selectedProduct.price.toString())
            const category = await askString("\nEnter category: ", selectedProduct.category)

            updateProduct(selectedProduct.id, name, price, category)

            term.clear()
            term.green(`Product updated: \nId:${selectedProduct.id}\nName: ${name}\nPrice: ${price}\nCategory: ${category}`)
            term.once('key', () => {
                mainBusinessView()
            })
        }
    }
)

}