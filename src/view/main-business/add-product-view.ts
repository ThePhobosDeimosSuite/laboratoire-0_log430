var term = require( 'terminal-kit' ).terminal
import { addProduct } from '../../controller/controller'
import {askInput, askNumber, askString} from '../../utils/input-utils'
import mainBusinessView from './main-business-view'

export default async() => {
    term.clear()
    const name = await askString("\nEnter product name: ")
    const price = await askNumber("\nEnter product price: ")
    const category = await askString("\nEnter category: ")
    
    addProduct(name, price, category)

    mainBusinessView()
}