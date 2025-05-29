import { getStocks } from "../../controller/controller"
import { colorizeJSON } from "../../utils/output-utils"
import businessView from "./store-view"

var term = require( 'terminal-kit' ).terminal


export default async (shopId: number) => {
    term.clear()
    const stocks = await getStocks(shopId)
    const res = stocks.map(s => ({
        amount: s.amount,
        name: s.product.name,
        id: s.product.id
    }))

    colorizeJSON(res)
    term.once('key', () => {
        businessView(shopId)
    })
}