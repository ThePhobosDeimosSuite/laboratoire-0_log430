import SupplyCenterEmployee from "../../controller/supply-center-employee.js"
import appConst from "../../utils/app-const.js"
import supplyCenterView from "./supply-center-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit

export default async () => {
    const orders = await SupplyCenterEmployee.getOrder() 
    terminal.clear()
    terminal.yellow("List of current orders (press enter to accept, escape to cancel): ")

    const menu = orders.map(o => `Store : ${o.shopId}, Product: ${o.product.name}, Amount: ${o.amount}`)

    if (menu.length <= 0) {
        terminal.clear()
        terminal.red("No orders")
        terminal.once('key', () => {
            supplyCenterView()
        })
    } else {
        terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
            if(response.canceled) {
                supplyCenterView()
            } else {
                const selectedOrder = orders[response.selectedIndex]

                await SupplyCenterEmployee.removeOrder(selectedOrder.productId, selectedOrder.shopId) // Delete order
                await SupplyCenterEmployee.decrementStocks(
                    selectedOrder.productId,
                    selectedOrder.amount,
                    appConst.supplyCenterShopId) // Decrement stock for supply center
                await SupplyCenterEmployee.addStocks(
                    selectedOrder.productId,
                    selectedOrder.amount,
                    selectedOrder.shopId) //Increase stock for store

                terminal.green("Order sent!")
                terminal.once('key', () => {
                    supplyCenterView()
                })
            }
        })
    }
}