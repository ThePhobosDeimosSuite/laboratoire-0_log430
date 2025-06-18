import SalesService from "../../controller/sales-service.js";
import appConst from "../../shared-utils/app-const.js"
import { colorizeJSON } from "../../shared-utils/output-utils.js"
import mainBusinessView from "./main-business-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async () => {
    terminal.clear()

    const menu = appConst.storeShopId.map(id => `Store: ${id}`)
    terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            mainBusinessView()
        } else {
            const selectedStoreId = appConst.storeShopId[response.selectedIndex]
            const salesReport = await SalesService.getSalesReport(selectedStoreId)

            terminal.clear()

            terminal.cyan(`LIST OF ALL SALES FOR STORE (${selectedStoreId})\n`)
            colorizeJSON(salesReport.sales)
            
            terminal.once('key', () => {

                terminal.clear()

                terminal.cyan(`TOTAL SALES PRICE FOR (Store ${selectedStoreId}): ${salesReport.totalSalesPrice} $`)

                terminal.once('key', () => {

                    terminal.clear()

                    terminal.cyan(`MOST SOLD PRODUCT (total product sold): \n`)
                    colorizeJSON(salesReport.mostSoldProduct)

                    terminal.once('key', async () => {
                        terminal.clear()

                        terminal.cyan(`REMAINING STOCKS: \n`)
                        colorizeJSON(salesReport.stocks)

                        terminal.once('key', () => {    
                            mainBusinessView()
                        })
                    })
                })
            })
        }
    })
    // Total sales, total income, most sold product, stocks
}