import menuView from "../menu-view"
import createStockView from "./create-stock-view"
import deliverStockView from "./deliver-stock-view"

var term = require( 'terminal-kit' ).terminal


export default () => {
    term.clear()
    term.yellow("1-deliver stock to a store\n")
    term.yellow("2-DEBUG: Create new stock\n")
    term("3-Main menu\n")
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
                createStockView()
            break;
            case "3":
                menuView()
            break
            case "exit":
                term.processExit()
            break
        }
    })
}