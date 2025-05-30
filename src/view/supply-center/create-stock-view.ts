import SupplyCenterEmployee from "../../controller/supply-center-employee"
import appConst from "../../utils/app-const"
import { askNumber } from "../../utils/input-utils"
import supplyCenterView from "./supply-center-view"

var term = require( 'terminal-kit' ).terminal


export default async () => {
    term.clear()
    const products = await SupplyCenterEmployee.searchProduct(undefined, undefined, undefined, appConst.supplyCenterShopId)
    const menu = products.map(p => `${p.name} (Stock: ${p.stock[0]?.amount ?? 0})`)

    term.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            supplyCenterView()
        } else {
            const productId = products[response.selectedIndex].id
            const amount = await askNumber("\nAmount: ")
        
            await SupplyCenterEmployee.addStocks(productId, amount, appConst.supplyCenterShopId)
        
            supplyCenterView()
        }
    })
}