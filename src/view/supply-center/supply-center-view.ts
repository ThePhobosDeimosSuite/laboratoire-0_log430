import appConst from "../../shared-utils/app-const.js"
import menuView from "../menu-view.js"
import getStocksView from "../store/get-stocks-view.js"
import createStockView from "./create-stock-view.js"
import deliverStockView from "./deliver-stock-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default () => {
    terminal.clear()
    terminal.yellow("1-Deliver stock to a store\n")
    terminal.yellow("2-See supply center stock\n")
    terminal.yellow("3-Create new supply center stock\n")
    terminal.red("4-Main menu\n")
    terminal("Type 'exit' to exit\n")
    terminal("Enter value: ")

    terminal.inputField({ 
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
                terminal.processExit(0)
            break
            default:
                menuView()
            break
        }
    })
}