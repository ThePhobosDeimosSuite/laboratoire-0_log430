
import Manager from '../../controller/manager.js'
import appConst from "../../utils/app-const.js"
import { colorizeJSON } from "../../utils/output-utils.js"
import mainBusinessView from "./main-business-view.js"
import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export default async () => {
    terminal.clear()

    const menu = appConst.storeShopId.map(id => `Store: ${id}`)
    terminal.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            mainBusinessView()
        } else {
            // List of all sales 
            const selectedStoreId = appConst.storeShopId[response.selectedIndex]
            terminal.clear()
            const sales = await Manager.searchSales(undefined, selectedStoreId)

            const formatedSales = sales.map(s => ({
                isCancelled: s.isCancelled,
                salesPrice: s.totalPrice,
                productSold: s.productSales.map(p => ({
                    name: p.product.name,
                    price: p.product.price,
                    amount: p.amount
                }))
            }))

            terminal.cyan(`LIST OF ALL SALES FOR STORE (${selectedStoreId})\n`)
            colorizeJSON(formatedSales)
            
            terminal.once('key', () => {
                // Total of all sales
                const totalSalesPrice = sales.reduce((partialsum, a) => partialsum + a.totalPrice, 0)

                terminal.clear()
                terminal.cyan(`TOTAL SALES PRICE FOR (Store ${selectedStoreId}): ${totalSalesPrice} $`)

                terminal.once('key', () => {
                    // Total time a product has been sold
                    terminal.clear()
                    const groupedProductSales = {}

                    for(const sale of sales) {
                        if(sale.isCancelled) continue

                        for (const productSale of sale.productSales) {
                            const { name } = productSale.product

                            if(!groupedProductSales[name]) {
                                groupedProductSales[name] = productSale.amount
                            } else {
                                groupedProductSales[name] += productSale.amount
                            }
                        }
                    }


                    terminal.cyan(`MOST SOLD PRODUCT (total product sold): \n`)
                    colorizeJSON(groupedProductSales)

                    terminal.once('key', async () => {
                        terminal.clear()

                        terminal.cyan(`REMAINING STOCKS: \n`)

                        const stocks = await Manager.getStocks(selectedStoreId)
                        const formatedStocks = stocks.map(s => ({
                            amount: s.amount,
                            name: s.product.name
                        }))
                        colorizeJSON(formatedStocks)


                        terminal.once('key', () => {    
                            mainBusinessView()
                        })
                    })
                })
            })
        }
    })
    // Total sales, total income, most sold product, stocks
}