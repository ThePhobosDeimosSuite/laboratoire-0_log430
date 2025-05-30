import StoreEmployee from "../../controller/store-employee"
import { askNumber } from "../../utils/input-utils"
import businessView from "./store-view"

var term = require( 'terminal-kit' ).terminal


export default async (shopId: number) => {
    term.clear()

    const id = await askNumber("Enter sales id:")

    await StoreEmployee.cancelSales(id, shopId)
    const res = await StoreEmployee.searchSales(id, shopId)

    term.clear()
    term(JSON.stringify(res))
        
    term.inputField((error, input) => {
        businessView(shopId)
    })
}