import { colorizeJSON, headers } from "shared-utils";
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    terminal.clear()
    terminal.yellow("Loading...")

    const url = new URL(process.env.KONG_URL)

    url.pathname = `/api/store/${shopId}/stock`

    const stocksRes = await fetch(url.toString(), { headers: headers })
    const stocks = await stocksRes.json()

    terminal.clear()
    colorizeJSON(stocks)
    terminal.once('key', () => {
        businessView(shopId)
    })
}