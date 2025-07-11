import menuView from "../menu-view.js"
import addProductView from "./add-product-view.js"
// import dashboardView from "./dashboard-view.js"
// import salesReportView from "./sales-report-view.js"
// import updateProductView from "./update-product-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default () => {
    terminal.clear()
    terminal.brightMagenta("1-Create report for each store\n")
    terminal.brightMagenta("2-Dashboard\n")
    terminal.brightMagenta("3-Create product\n")
    terminal.brightMagenta("4-Update product\n")
    terminal.red("5-Main menu\n")
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
                // salesReportView()
            break
            case "2":
                // dashboardView()
            break
            case "3":
                addProductView() 
            break
            case "4":
                // updateProductView()
            break
            default:
                menuView()
            break
        }
    })
}