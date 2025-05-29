var term = require( 'terminal-kit' ).terminal
import cancelSales from "./cancel-sales-view"
import createSales from "./create-sales-view"
import getStocks from "./get-stocks-view"
import menuView from "../menu-view"
import searchProduct from "./search-product-view"
import searchSales from "./search-sales-view"
import orderMoreStocksView from "./order-more-stocks-view"

export default (shopId: number) => {
    term.clear()
    term.brightCyan("1-Search product\n")
    term.brightCyan("2-Create sales\n")
    term.brightCyan("3-Search sales\n")
    term.brightCyan("4-Cancel sales\n")
    term.brightCyan("5-Get stocks\n")
    term.brightCyan("6-Order more stocks\n")
    term.brightCyan("7-Main menu\n")
    term("Type 'exit' to exit\n")
    term("Enter value: ")
    term.inputField({ 
        echo: true, 
        cancelable: true 
    }, async (error, input) => {
        switch(input) {
            case "exit": 
                term.processExit()
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
                orderMoreStocksView(shopId)
            break
            case "7": 
                menuView()
            break
            default:
                menuView()
            break
        }
    })
}