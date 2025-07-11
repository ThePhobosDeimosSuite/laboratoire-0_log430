import menuView from "../menu-view.js"
import addProductView from "./add-product-view.js"
import updateProductView from "./update-product-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default () => {
    terminal.clear()
    terminal.brightMagenta("1-Create product\n")
    terminal.brightMagenta("2-Update product\n")
    terminal.red("3-Main menu\n")
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
                addProductView() 
            break
            case "2":
                updateProductView()
            break
            default:
                menuView()
            break
        }
    })
}
