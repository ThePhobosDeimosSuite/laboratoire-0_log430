import menuView from "../menu-view"
import addProductView from "./add-product-view"

var term = require( 'terminal-kit' ).terminal


export default () => {
    term.clear()
    term("1-Create report for each store\n")
    term("2-Check stocks\n")
    term("3-Dashboard\n")
    term("4-Create product\n")
    term("5-Update product\n")
    term("6-Main menu\n")
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