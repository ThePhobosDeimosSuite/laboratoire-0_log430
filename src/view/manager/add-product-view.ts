import terminalKit from "terminal-kit";
const { terminal } = terminalKit
import mainBusinessView from './main-business-view.js'
import { askNumber, askString, headers } from "shared-utils";

export default async() => {
    terminal.clear()
    const name = await askString("\nEnter product name: ")
    const price = await askNumber("\nEnter product price: ")
    const category = await askString("\nEnter category: ")

    await fetch(`${process.env.KONG_URL}/api/product`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            price,
            category
        })
    })

    mainBusinessView()
}