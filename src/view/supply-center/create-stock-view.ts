import SupplyCenterEmployee from "../../controller/supply-center-employee.js"
import appConst from "../../utils/app-const.js"
import { askNumber } from "../../utils/input-utils.js"
import supplyCenterView from "./supply-center-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async () => {
    terminal.clear()
    const products = await SupplyCenterEmployee.searchProduct(undefined, undefined, undefined, appConst.supplyCenterShopId)
    const menu = products.map(p => `${p.name} (Stock: ${p.stock[0]?.amount ?? 0})`)

    terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
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