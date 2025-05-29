var term = require( 'terminal-kit' ).terminal
import businessView from "./store/store-view"
import mainBusinessView from "./main-business/main-business-view"
import supplyCenterView from "./supply-center/supply-center-view"

export default () => {   
    term.clear()
    term("Who are you?\n")
    term.brightCyan("1-Store 1\n")
    term.brightCyan("2-Store 2\n")
    term.brightCyan("3-Store 3\n")
    term.brightCyan("4-Store 4\n")
    term.brightCyan("5-Store 5\n")
    term.green("6-Main business\n")
    term.yellow("7-Supply center\n")
    term("Type 'exit' to exit\n")
    term("Enter value: ")    
    term.inputField({ 
        echo: true, 
        cancelable: true 
    }, (error, input) => {
        if(input <= 1 || input <= 5) {
            businessView(Number(input))
        } else if (input == "6") {
            mainBusinessView()
        } else if (input == "7") {
            supplyCenterView()
        } else {
            term.processExit();
        }
    })
}
    