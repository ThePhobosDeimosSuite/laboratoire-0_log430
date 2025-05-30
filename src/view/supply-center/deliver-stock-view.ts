import SupplyCenterEmployee from "../../controller/supply-center-employee"
import appConst from "../../utils/app-const"
import { colorizeJSON } from "../../utils/output-utils"
import supplyCenterView from "./supply-center-view"

var term = require( 'terminal-kit' ).terminal

export default async () => {
    const orders = await SupplyCenterEmployee.getOrder() 
    term.clear()
    term.yellow("List of current orders (press enter to accept, escape to cancel): ")

    const menu = orders.map(o => `Store : ${o.shopId}, Product: ${o.product.name}, Amount: ${o.amount}`)

    if (menu.length <= 0) {
        term.clear()
        term.red("No orders")
        term.once('key', () => {
            supplyCenterView()
        })
    } else {
        term.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
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

                term.green("Order sent!")
                term.once('key', () => {
                    supplyCenterView()
                })
            }
        })
    }
}