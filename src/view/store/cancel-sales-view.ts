import { askNumber, headers } from "shared-utils";
import businessView from "./store-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async (shopId: number) => {
    terminal.clear()

    const id = await askNumber("Enter sales id:")

    const url = new URL(process.env.KONG_URL)
    url.pathname = `/api/store/${shopId}/sales/${id}`

    await fetch(url.toString(), { method: 'DELETE', headers: headers })

    businessView(shopId)
}