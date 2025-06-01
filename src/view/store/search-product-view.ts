import terminalKit from "terminal-kit";
const { terminal } = terminalKit
import StoreEmployee from "../../controller/store-employee.js"
import businessView from './store-view.js'
import { askString} from '../../utils/input-utils.js'
import { colorizeJSON } from '../../utils/output-utils.js'


export default async (shopId: number) => {
    terminal.clear()

    const id = await askString("Enter id (press enter to dismiss): ")
    const name = await askString("\nEnter name (press enter to dismiss): ")
    const category = await askString("\nEnter category (press enter to dismiss): ")

    const res = await StoreEmployee.searchProduct(
        id == "" ? undefined : Number(id), 
        name == "" ? undefined : name, 
        category == "" ? undefined : category,
        shopId
    )
    terminal.clear()
    colorizeJSON(res)
    
    terminal.inputField((error, input) => {
        businessView(shopId)
    })
}