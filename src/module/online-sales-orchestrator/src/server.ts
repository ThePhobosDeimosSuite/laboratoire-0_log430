import express, { Request, Response } from 'express'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'

import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'
import { isProductSalesType, ProductSale } from 'shared-utils'
import SalesOrchestratorService from './sales-orchestrator-service.js'
import { logger } from './app.js'


const app = express()
const router = express.Router()

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())

app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))

/**
 * @swagger
 * /api/store/:storeId/client/:clientId/cart:
 *   post:
 *     description: Create new shopping cart for shop and client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productSales
 *             properties:
 *               productSales:
 *                 type: array
 *                 description: List of product being sold
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - amount
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID of the product
 *                     amount:
 *                       type: integer
 *                       description: Quantity sold
 *     parameters: 
 *       - name: storeId
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *       - name: clientId
 *         in: path
 *         description: Client ID
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Shopping cart added
 *       400:
 *         description: Error in body
 * 
 */
router.post('/store/:storeId/client/:clientId/cart', async (req: Request, res: Response) => {
    let stockReduced = false
    const { storeId, clientId } = req.params
    
    const productSales = isProductSalesType(req.body.productSales) && req.body.productSales as ProductSale[]
    
    if (productSales) { // TODO check if this is working
        try {
            // Check stocks
            await SalesOrchestratorService.checkProductSalesStocks(Number(storeId), productSales)
            logger.info("StocksChecked")
            
            // Remove stocks
            await SalesOrchestratorService.decreaseStocks(Number(storeId), productSales)
            logger.info("StocksReduced")
            stockReduced = true

            // Create shopping cart entry
            await SalesOrchestratorService.createShoppingCart(Number(storeId), Number(clientId), productSales)
            logger.info("ShoppingCartCreated")

            // Return price
            const totalPrice = await SalesOrchestratorService.getProductSalesPrice(productSales)
            logger.info("PriceFetched")

            res.send(`Total price of cart is : ${totalPrice}$`)
        } catch (e) {
            if(stockReduced) {
                await SalesOrchestratorService.increaseStocks(Number(storeId), productSales)
            }
            res.status(400).send(e.message)
            logger.error(e.message)
        }
    } else {
         res.status(400).send("Product sales is invalid")
    }
})

 /**
 * @swagger
 * /api/store/:storeId/client/:clientId/cart/checkout:
 *   post:
 *     description: Confirm a sale and clear the shopping cart
 *     parameters: 
 *       - name: storeId
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *       - name: clientId
 *         in: path
 *         description: Client ID
 *         type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Success
 */
router.post('/store/:storeId/client/:clientId/cart/checkout', async (req: Request, res: Response) => {
    const payment = Number(req.body.payment)
    const { storeId, clientId } = req.params

    if (payment) {
        try {
            // Get cart price
            const productSales = await SalesOrchestratorService.getShoppingCart(Number(storeId), Number(clientId))
            logger.info("ShoppingCartFetched")
            const totalPrice = await SalesOrchestratorService.getProductSalesPrice(productSales)
            logger.info("PriceFetched")

            let response: string
            // Check payment
            if(totalPrice <= payment) {
                logger.info("PaymentAccepted")
                await SalesOrchestratorService.addSales(Number(storeId), productSales)
                logger.info("SalesAdded")
                response = "Payment accepted"
            } else {
                logger.info("PaymentRefused")
                await SalesOrchestratorService.increaseStocks(Number(storeId), productSales)
                logger.info("RevertStocks")
                response = "Payment denied"
            }

            // Remove cart
            await SalesOrchestratorService.deleteShoppingCart(Number(storeId), Number(clientId))
            logger.info("ShoppingCartDeleted")

            res.send(response)

        } catch (e) {
            res.status(400).send(e.message)
            logger.error(e.message)
        }
        } else {
            res.status(400).send("Payment is invalid")
        }
        
})


app.use("/api", router)

export default app