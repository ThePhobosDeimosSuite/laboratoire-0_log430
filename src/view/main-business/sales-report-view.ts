
import { getStocks, searchSales } from "../../controller/controller"
import appConst from "../../utils/app-const"
import { colorizeJSON } from "../../utils/output-utils"
import mainBusinessView from "./main-business-view"

var term = require( 'terminal-kit' ).terminal


export default async () => {
    term.clear()

    const menu = appConst.storeShopId.map(id => `Store: ${id}`)
    term.singleColumnMenu(menu, { cancelable: true }, async (error, response) => {
        if (response.canceled) {
            mainBusinessView()
        } else {
            // List of all sales 
            const selectedStoreId = appConst.storeShopId[response.selectedIndex]
            term.clear()
            const sales = await searchSales(undefined, selectedStoreId)

            const formatedSales = sales.map(s => ({
                isCancelled: s.isCancelled,
                salesPrice: s.totalPrice,
                productSold: s.productSales.map(p => ({
                    name: p.product.name,
                    price: p.product.price,
                    amount: p.amount
                }))
            }))

            term.cyan(`LIST OF ALL SALES FOR STORE (${selectedStoreId})\n`)
            colorizeJSON(formatedSales)
            
            term.once('key', () => {
                // Total of all sales
                const totalSalesPrice = sales.reduce((partialsum, a) => partialsum + a.totalPrice, 0)

                term.clear()
                term.cyan(`TOTAL SALES PRICE FOR (Store ${selectedStoreId}): ${totalSalesPrice} $`)

                term.once('key', () => {
                    // Total time a product has been sold
                    term.clear()
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


                    term.cyan(`MOST SOLD PRODUCT: \n`)
                    colorizeJSON(groupedProductSales)

                    term.once('key', async () => {
                        term.clear()

                        term.cyan(`REMAINING STOCKS: \n`)

                        const stocks = await getStocks(selectedStoreId)
                        const formatedStocks = stocks.map(s => ({
                            amount: s.amount,
                            name: s.product.name
                        }))
                        colorizeJSON(formatedStocks)


                        term.once('key', () => {    
                            mainBusinessView()
                        })
                    })
                })
            })
        }
    })
    // Total sales, total income, most sold product, stocks
}