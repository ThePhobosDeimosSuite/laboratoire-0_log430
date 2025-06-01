import StoreEmployee from "../../controller/store-employee.js"
import appConst from "../../utils/app-const.js";
import { colorizeJSON } from "../../utils/output-utils.js"
import supplyCenterView from "../supply-center/supply-center-view.js";
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    terminal.clear()
    const stocks = await StoreEmployee.getStocks(shopId)
    const res = stocks.map(s => ({
        amount: s.amount,
        name: s.product.name,
        id: s.product.id
    }))

    colorizeJSON(res)
    terminal.once('key', () => {
        if(shopId == appConst.supplyCenterShopId) {
            supplyCenterView()
        } else {
            businessView(shopId)
        }
    })
}