import StoreEmployee from "../../controller/store-employee"
import { askNumber } from "../../utils/input-utils"
import { colorizeJSON } from "../../utils/output-utils"
import businessView from "./store-view"

var term = require( 'terminal-kit' ).terminal


export default async (shopId: number) => {
    term.clear()

    const id = await askNumber("Enter sales id (empty to view all sales):")

    const res = await StoreEmployee.searchSales(id == 0 ? undefined : id, shopId)

    term.clear()
    colorizeJSON(res)
        
    term.inputField((error, input) => {
        businessView(shopId)
    })
}