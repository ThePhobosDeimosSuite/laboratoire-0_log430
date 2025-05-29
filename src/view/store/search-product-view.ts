var term = require( 'terminal-kit' ).terminal
import { searchProduct } from '../../controller/controller'
import businessView from './store-view'
import { askString} from '../../utils/input-utils'
import { colorizeJSON } from '../../utils/output-utils'


export default async (shopId: number) => {
    term.clear()

    const id = await askString("Enter id (press enter to dismiss): ")
    const name = await askString("\nEnter name (press enter to dismiss): ")
    const category = await askString("\nEnter category (press enter to dismiss): ")

    const res = await searchProduct(
        id == "" ? undefined : Number(id), 
        name == "" ? undefined : name, 
        category == "" ? undefined : category,
        shopId
    )
    term.clear()
    colorizeJSON(res)
    
    term.inputField((error, input) => {
        businessView(shopId)
    })
}