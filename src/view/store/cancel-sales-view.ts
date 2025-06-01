import StoreEmployee from "../../controller/store-employee.js"
import { askNumber } from "../../utils/input-utils.js"
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    terminal.clear()

    const id = await askNumber("Enter sales id:")

    await StoreEmployee.cancelSales(id, shopId)
    const res = await StoreEmployee.searchSales(id, shopId)

    terminal.clear()
    terminal(JSON.stringify(res))
        
    terminal.inputField((error, input) => {
        businessView(shopId)
    })
}