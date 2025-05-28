import menuView from "../menu-view"
import addProductView from "./add-product-view"

var term = require( 'terminal-kit' ).terminal


export default () => {
    term.clear()
    term.green("1-Create report for each store\n")
    term.green("2-Check stocks\n")
    term.green("3-Dashboard\n")
    term.green("4-Create product\n")
    term.green("5-Update product\n")
    term.green("6-Main menu\n")
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
            case "4":
                addProductView() 
            break
            case "6": 
                menuView()
        }
    })
}