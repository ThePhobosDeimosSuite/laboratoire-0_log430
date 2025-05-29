import menuView from "../menu-view"
import addProductView from "./add-product-view"
import dashboardView from "./dashboard-view"
import salesReportView from "./sales-report-view"
import updateProductView from "./update-product-view"

var term = require( 'terminal-kit' ).terminal


export default () => {
    term.clear()
    term.green("1-Create report for each store\n")
    term.green("2-Dashboard\n")
    term.green("3-Create product\n")
    term.green("4-Update product\n")
    term.green("5-Main menu\n")
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
                salesReportView()
            break
            case "2":
                dashboardView()
            break
            case "3":
                addProductView() 
            break
            case "4":
                updateProductView()
            break
            default:
                menuView()
            break
        }
    })
}