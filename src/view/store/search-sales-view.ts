import SalesService from "../../controller/sales-service.js";
import { askNumber } from "../../utils/input-utils.js"
import { colorizeJSON } from "../../utils/output-utils.js"
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    terminal.clear()

    const id = await askNumber("Enter sales id (empty to view all sales):")

    const res = await SalesService.searchSales(id == 0 ? undefined : id, shopId)

    terminal.clear()
    colorizeJSON(res)
        
    terminal.inputField((error, input) => {
        businessView(shopId)
    })
}