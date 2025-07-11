import terminalKit from "terminal-kit";
const { terminal } = terminalKit
import businessView from './store-view.js'
import { askString, colorizeJSON, headers } from "shared-utils";


export default async (shopId: number) => {
    terminal.clear()

    const id = await askString("Enter id (press enter to dismiss): ")
    const name = await askString("\nEnter name (press enter to dismiss): ")
    const category = await askString("\nEnter category (press enter to dismiss): ")

    const url = new URL(`${process.env.KONG_URL}/api/product`)

    id && url.searchParams.append('id', id)
    name && url.searchParams.append('name', name)
    category && url.searchParams.append('category', category)
    const res = await fetch(url.toString(), { headers: headers })
    const body = await res.json()

    terminal.clear()
    colorizeJSON(body)
    
    terminal.inputField((error, input) => {
        businessView(shopId)
    })
}