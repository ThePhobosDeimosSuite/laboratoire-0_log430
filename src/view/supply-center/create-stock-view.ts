import { addStocks } from "../../controller/controller"
import appConst from "../../utils/app-const"
import { askNumber } from "../../utils/input-utils"
import supplyCenterView from "./supply-center-view"

var term = require( 'terminal-kit' ).terminal


export default async () => {
    term.clear()
    const productId = await askNumber("productId: ")
    const amount = await askNumber("\nAmount: ")

    await addStocks(productId, amount, appConst.supplyCenterShopId)

    supplyCenterView()
}