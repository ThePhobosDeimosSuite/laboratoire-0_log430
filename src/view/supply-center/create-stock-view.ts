import ProductService from "../../controller/product-service.js";
import StocksService from "../../controller/stocks-service.js";
import appConst from "../../shared-utils/app-const.js"
import { askNumber } from "../../shared-utils/input-utils.js"
import supplyCenterView from "./supply-center-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async () => {
    terminal.clear()
    const products = await ProductService.searchProduct(undefined, undefined, undefined, appConst.supplyCenterShopId)
    const menu = products.map(p => `${p.name} (Stock: ${p.stock[0]?.amount ?? 0})`)

    terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            supplyCenterView()
        } else {
            const productId = products[response.selectedIndex].id
            const amount = await askNumber("\nAmount: ")
        
            await StocksService.addStocks(productId, amount, appConst.supplyCenterShopId)
        
            supplyCenterView()
        }
    })
}