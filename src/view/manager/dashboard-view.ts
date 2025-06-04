import Manager from '../../controller/manager.js'
import appConst from "../../utils/app-const.js"
import { colorizeJSON } from "../../utils/output-utils.js"
import mainBusinessView from "./main-business-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async () => {
    terminal.clear()

    const dashboardView = await Manager.getDashboardView()

    terminal.cyan("TOTAL SALES PER STORE: ")
    colorizeJSON(dashboardView.allSalesPerStore)

    terminal.once('key', async () => {
        terminal.clear()

        terminal.red("LOW STOCK (below 5): \n")
        colorizeJSON(dashboardView.lowStocksPerStore)

        terminal.once('key', async () => {
            terminal.clear()

            terminal.green("HIGH STOCK (above 100): \n")
            colorizeJSON(dashboardView.highStocksPerStore)

            terminal.once('key', async () => {
                mainBusinessView()
            })
        })
     })

    // Total of all sales per store, stocks below 5, stocks above 75
}
