import terminalKit from "terminal-kit";
const { terminal } = terminalKit
import cancelSales from "./cancel-sales-view.js"
import createSales from "./create-sales-view.js"
import getStocks from "./get-stocks-view.js"
import menuView from "../menu-view.js"
import searchProduct from "./search-product-view.js"
import searchSales from "./search-sales-view.js"

export default (shopId: number) => {
    terminal.clear()
    terminal.brightCyan("1-Search product\n")
    terminal.brightCyan("2-Create sales\n")
    terminal.brightCyan("3-Search sales\n")
    terminal.brightCyan("4-Cancel sales\n")
    terminal.brightCyan("5-Get stocks\n")
    terminal.red("6-Main menu\n")
    terminal("Type 'exit' to exit\n")
    terminal("Enter value: ")
    terminal.inputField({ 
        echo: true, 
        cancelable: true 
    }, async (error, input) => {
        switch(input) {
            case "exit": 
                terminal.processExit(0)
            break
            case "1":
                searchProduct(shopId)
            break
            case "2": 
                createSales(shopId)
            break
            case "3": 
                searchSales(shopId)
            break
            case "4": 
                cancelSales(shopId)
            break
            case "5": 
                getStocks(shopId)
            break
            case "6": 
                menuView()
            break
            default:
                menuView()
            break
        }
    })
}