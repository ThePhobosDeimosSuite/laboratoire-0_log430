import terminalKit from "terminal-kit";
const { terminal } = terminalKit
import businessView from "./store/store-view.js"
import mainBusinessView from "./manager/main-business-view.js"
import supplyCenterView from "./supply-center/supply-center-view.js"

function menuView () {   
    terminal.clear()
    terminal("Who are you?\n")
    terminal.brightCyan("1-Store 1\n")
    terminal.brightCyan("2-Store 2\n")
    terminal.brightCyan("3-Store 3\n")
    terminal.brightCyan("4-Store 4\n")
    terminal.brightCyan("5-Store 5\n")
    terminal.yellow("6-Supply center\n")
    terminal.brightMagenta("7-Main business\n")
    terminal("Type 'exit' to exit\n")
    terminal("Enter value: ")    
    terminal.inputField({ 
        echo: true, 
        cancelable: true 
    }, (error, input) => {
        if(Number(input) <= 1 || Number(input) <= 5) {
            businessView(Number(input))
        } else if (input == "6") {
            supplyCenterView()
        } else if (input == "7") {
            mainBusinessView()
        } else {
            terminal.processExit(0);
        }
    })
}
    

menuView()

export default menuView