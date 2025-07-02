import { ProductSale } from "shared-utils/index.js"
import APIError from "./api-error.js"

const shoppingCartServiceUrl = process.env.SHOPPING_CART_SERVICE_URL
const productServiceUrl = process.env.PRODUCT_SERVICE_URL
const stocksServiceUrl = process.env.STOCKS_SERVICE_URL
const salesServiceUrl = process.env.SALES_SERVICE_URL

export default class SalesOrchestratorService {

    static async checkProductSalesStocks(storeId:number, productSales: ProductSale[]) {
        const url = `${stocksServiceUrl}/api/store/${storeId}/stock`
        const response = await fetch(url)
        const body = await response.json()

        if(response.ok && Array.isArray(body)) {
            for(const productSale of productSales) {
                const stockServiceProductSale = body.find(p => p.productId == productSale.productId)
                if(!stockServiceProductSale) {
                    throw new Error(`ProductId:${productSale.productId} has no stocks in store ${storeId}`)
                } else if (stockServiceProductSale.amount < productSale.amount) {
                    throw new Error(`ProductId:${productSale.productId} has ${stockServiceProductSale.amount} stocks`)
                }
            }
        } else {
            throw new APIError(`Error sending request to StocksService`, 500)
        }
    }

    static async decreaseStocks(storeId: number, productSales: ProductSale[]) {
        const url = `${stocksServiceUrl}/api/store/${storeId}/stock`

        for (const productSale of productSales) {
            const requestBody = {
                productId: productSale.productId,
                amount: productSale.amount,
                decrement: true
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if(!response.ok) {
                throw new APIError(`Error while reducing stocks for product ${productSale.productId} in StocksService`, 500)
            }
        }
    }

    static async increaseStocks(storeId: number, productSales: ProductSale[]) {
        const url = `${stocksServiceUrl}/api/store/${storeId}/stock`

        for (const productSale of productSales) {
            const requestBody = {
                productId: productSale.productId,
                amount: productSale.amount,
                increment: true
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if(!response.ok) {
                throw new APIError(`Error while reducing stocks for product ${productSale.productId} in StocksService`, 500)
            }
        }
    }

    static async createShoppingCart(storeId: number, clientId: number, productSales: ProductSale[]) {
        const url = `${shoppingCartServiceUrl}/api/store/${storeId}/client/${clientId}/cart`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productSales})
        })

        if(response.status == 409) {
            throw new APIError(`A shopping cart already exist for user ${clientId} in store ${storeId}`, 409)
        } else if (!response.ok) {
            throw new APIError(`Error while sending shopping cart to ShoppingCartService`, 500)
        }
    }

    static async getShoppingCart(storeId: number, clientId: number) {
        const url = `${shoppingCartServiceUrl}/api/store/${storeId}/client/${clientId}/cart`

        const response = await fetch(url)
        if(response.ok) {
            const body = await response.json()
            return (body.productSales.map(p => ({productId: p.productId, amount: p.amount}))) as ProductSale[]
        } else if (response.status == 404) {   
            throw new APIError(`Shopping cart doesn't exist for client ${clientId} in store ${storeId}`, 404)
        } else {
            throw new APIError(`Error while fetching cart from ShoppingCartService`, 500)
        }
    }

    static async deleteShoppingCart(storeId: number, clientId: number) {
        const url = `${shoppingCartServiceUrl}/api/store/${storeId}/client/${clientId}/cart`

        const response = await fetch(url, {
            method: 'DELETE'
        }) 

        if(!response.ok) {
            throw new APIError(`Error while deleting shopping cart for user ${clientId} in store ${storeId}`, 500)
        }

    }

    static async getProductSalesPrice(productSales: ProductSale[]) {
        let totalAmount: number = 0
        for(const productSale of productSales) {
            const url = `${productServiceUrl}/api/product?id=${productSale.productId}`

            const response = await fetch(url)
            if(response.ok){
                const body = await response.json()
                const product = body[0]
                totalAmount += product.price * productSale.amount
            } else {
                throw new APIError(`Error while fetching product ${productSale.productId} from ProductService`, 500)
            }
        }
        return totalAmount
    }

    static async addSales(storeId: number, productSales: ProductSale[]) {
        const url = `${salesServiceUrl}/api/store/${storeId}/sales`
        
        const response = await fetch(url,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productSales})
        })

        if(!response.ok) {
            throw new APIError(`Error while adding sale to SalesService in store ${storeId}`, 500)
        }
    }
}