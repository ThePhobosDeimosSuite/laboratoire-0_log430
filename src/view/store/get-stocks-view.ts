import { getStocks } from "../../controller/controller"
import businessView from "./store-view"

var term = require( 'terminal-kit' ).terminal


export default async (shopId: number) => {
    term.clear()
    const res = await getStocks(shopId)

    term(JSON.stringify(res))
            
    term.inputField((error, input) => {
        businessView(shopId)
    })
}