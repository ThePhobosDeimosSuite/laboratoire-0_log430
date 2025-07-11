import menuView from "../menu-view.js"
import deliverStockView from "./deliver-stock-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default () => {
    terminal.clear()
    terminal.yellow("1-Deliver stock to a store\n")
    terminal.red("2-Main menu\n")
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
            case "exit":
                terminal.processExit(0)
            break
            default:
                menuView()
            break
        }
    })
}