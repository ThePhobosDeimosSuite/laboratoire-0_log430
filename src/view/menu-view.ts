var term = require( 'terminal-kit' ).terminal
import businessView from "./store/store-view"
import mainBusinessView from "./main-business/main-business-view"
import supplyCenterView from "./supply-center/supply-center-view"

export default () => {   
    term.clear()
    term("Who are you?\n")
    term("1-Business 1\n")
    term("2-Business 2\n")
    term("3-Business 3\n")
    term("4-Business 4\n")
    term("5-Business 5\n")
    term("6-Main business\n")
    term("7-Supply center\n")
    term("Type 'exit' to exit\n")
    term("Enter value: ")    
    term.inputField({ 
        echo: true, 
        cancelable: true 
    }, (error, input) => {
        if(input == "exit") {
            term.processExit();
        } else if (input == "6") {
            mainBusinessView()
        } else if (input == "7") {
            supplyCenterView()
        } else {
            businessView(Number(input))
        }
    })
}
    