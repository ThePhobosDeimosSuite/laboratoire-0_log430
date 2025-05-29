
import { searchSales } from "../../controller/controller"
import appConst from "../../utils/app-const"

var term = require( 'terminal-kit' ).terminal


export default async () => {
    term.clear()

    const menu = appConst.storeShopId.map(id => `Store :${id}`)
    // const sales = await searchSales(undefined, id)
    // Total sales, total income, most sold product, stocks
}