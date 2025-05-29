import appConst from "../../utils/app-const"
import menuView from "../menu-view"
import getStocksView from "../store/get-stocks-view"
import createStockView from "./create-stock-view"
import deliverStockView from "./deliver-stock-view"

var term = require( 'terminal-kit' ).terminal


export default () => {
    term.clear()
    term.yellow("1-deliver stock to a store\n")
    term.yellow("2-See supply center stock\n")
    term.yellow("3-Create new stock\n")
    term.yellow("4-Main menu\n")
    term("Type 'exit' to exit\n")
    term("Enter value: ")

    term.inputField({ 
        echo: true, 
        cancelable: true 
    }, async (error, input) => {
        switch(input) {
            case "1": 
                deliverStockView()
            break
            case "2": 
                getStocksView(appConst.supplyCenterShopId)
            break
            case "3": 
                createStockView()
            break;
            case "exit":
                term.processExit()
            break
            default:
                menuView()
            break
        }
    })
}