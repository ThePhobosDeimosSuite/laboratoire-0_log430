import { searchSales, cancelSales } from "../../controller/controller"
import { askNumber } from "../../utils/input-utils"
import businessView from "./store-view"

var term = require( 'terminal-kit' ).terminal


export default async (shopId: number) => {
    term.clear()

    const id = await askNumber("Enter sales id:")

    await cancelSales(id, shopId)
    const res = await searchSales(id, shopId)

    term.clear()
    term(JSON.stringify(res))
        
    term.inputField((error, input) => {
        businessView(shopId)
    })
}