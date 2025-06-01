import terminalKit from "terminal-kit";
const { terminal } = terminalKit
import Manager from '../../controller/manager.js'
import { askNumber, askString} from '../../utils/input-utils.js'
import mainBusinessView from './main-business-view.js'

export default async() => {
    terminal.clear()
    const name = await askString("\nEnter product name: ")
    const price = await askNumber("\nEnter product price: ")
    const category = await askString("\nEnter category: ")
    
    Manager.addProduct(name, price, category)

    mainBusinessView()
}