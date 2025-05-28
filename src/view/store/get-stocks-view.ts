import { getStocks } from "../../controller/controller"
import { colorizeJSON } from "../../utils/output-utils"
import businessView from "./store-view"

var term = require( 'terminal-kit' ).terminal


export default async (shopId: number) => {
    term.clear()
    const res = await getStocks(shopId)

    colorizeJSON(res)
    term.once('key', () => {
        businessView(shopId)
    })
}