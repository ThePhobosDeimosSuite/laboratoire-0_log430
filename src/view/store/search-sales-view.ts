import { askNumber, colorizeJSON, headers } from "shared-utils";
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    terminal.clear()

    const id = await askNumber("Enter sales id (empty to view all sales):")

    terminal.clear()
    terminal.yellow("Loading...")

    const url = new URL(process.env.KONG_URL)

    if(id){
        url.pathname = `/api/store/${shopId}/sales/${id}`
    } else {
        url.pathname = `/api/store/${shopId}/sales`
    }

    const salesRes = await fetch(url.toString(), { headers: headers })
    const sales = await salesRes.json()


    terminal.clear()
    colorizeJSON(sales)
        
    terminal.inputField((error, input) => {
        businessView(shopId)
    })
}