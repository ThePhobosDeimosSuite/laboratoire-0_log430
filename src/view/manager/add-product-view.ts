import terminalKit from "terminal-kit";
const { terminal } = terminalKit
import { askNumber, askString} from '../../shared-utils/input-utils.js'
import mainBusinessView from './main-business-view.js'
import ProductService from "../../controller/product-service.js";

export default async() => {
    terminal.clear()
    const name = await askString("\nEnter product name: ")
    const price = await askNumber("\nEnter product price: ")
    const category = await askString("\nEnter category: ")
    
    ProductService.addProduct(name, price, category)

    mainBusinessView()
}