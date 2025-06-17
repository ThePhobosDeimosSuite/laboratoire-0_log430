import SalesService from "../../controller/sales-service.js";
import { askNumber } from "../../utils/input-utils.js"
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    terminal.clear()

    const id = await askNumber("Enter sales id:")

    await SalesService.cancelSales(id, shopId)
    const res = await SalesService.searchSales(id, shopId)

    terminal.clear()
    terminal(JSON.stringify(res))
        
    terminal.inputField((error, input) => {
        businessView(shopId)
    })
}