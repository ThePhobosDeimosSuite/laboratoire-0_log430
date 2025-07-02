import express, { Request, Response } from 'express'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import prometheusClient from 'prom-client'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'
import { isProductSalesType, ProductSale } from 'shared-utils'
import SalesOrchestratorService from './sales-orchestrator-service.js'
// import { logger } from './app.js'
import winston from 'winston';
import APIError from './api-error.js'


const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

const app = express()
const router = express.Router()

// TODO move this to other file???
const register = new prometheusClient.Registry()
const sagaCounter = new prometheusClient.Counter({
    name: 'saga_counter',
    help: 'counts the number of initiated saga',
    labelNames: ['total']
})

const sagaStateTimeHistogram = new prometheusClient.Histogram({
    name: 'state_time_counter',
    help: 'average time per state ',
    labelNames: ['state'],
    buckets: [0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
})



register.registerMetric(sagaCounter)

app.use(new ExpressPrometheusMiddleware().handler)

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.use(express.json())

app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))

enum State {
    StocksChecked,
    StocksReduced,
    ShoppingCartCreated,
    PriceFetched,
    ShoppingCartFetch,
    PaymentAccepted,
    SalesAdded,
    PaymentRefused,
    StocksReverted,
    ShoppingCartDeleted,
    SagaEnded
}

// let state: State
let timerEnd
function updateState(newState: State) {
    if (timerEnd) {
        timerEnd()
    }
    logger.info(newState.toString())
    // state = newState
    timerEnd = sagaStateTimeHistogram.startTimer({ state: newState })
}

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

    sagaCounter.inc(1)

    let stockReduced = false
    const { storeId, clientId } = req.params

    const productSales = isProductSalesType(req.body.productSales) && req.body.productSales as ProductSale[]
    if (productSales) {
        try {
            // Check stocks
            await SalesOrchestratorService.checkProductSalesStocks(Number(storeId), productSales)
            updateState(State.StocksChecked)

            // Remove stocks
            await SalesOrchestratorService.decreaseStocks(Number(storeId), productSales)
            updateState(State.StocksReduced)
            stockReduced = true

            // Create shopping cart entry
            await SalesOrchestratorService.createShoppingCart(Number(storeId), Number(clientId), productSales)
            updateState(State.ShoppingCartCreated)

            // Return price
            const totalPrice = await SalesOrchestratorService.getProductSalesPrice(productSales)
            updateState(State.PriceFetched)

            res.send(`Total price of cart is : ${totalPrice}$`)
        } catch (e) {
            if (e instanceof APIError) {
                const apiError = e as APIError
                if (stockReduced) {
                    await SalesOrchestratorService.increaseStocks(Number(storeId), productSales)
                    updateState(State.StocksReverted)
                }
                updateState(State.SagaEnded)
                res.status(apiError.code).send(apiError.message)
                logger.error(apiError.message)
            }
        }
    } else {
        res.status(400).send("Body is invalid")
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
            updateState(State.ShoppingCartFetch)
            const totalPrice = await SalesOrchestratorService.getProductSalesPrice(productSales)
            updateState(State.PriceFetched)

            // Check payment
            if (totalPrice <= payment) {
                updateState(State.PaymentAccepted)
                await SalesOrchestratorService.addSales(Number(storeId), productSales)
                updateState(State.SalesAdded)

                // Remove cart
                await SalesOrchestratorService.deleteShoppingCart(Number(storeId), Number(clientId))
                updateState(State.ShoppingCartDeleted)
                updateState(State.SagaEnded)

                res.send("Payment accepted")

            } else {
                updateState(State.PaymentRefused)
                await SalesOrchestratorService.increaseStocks(Number(storeId), productSales)
                updateState(State.StocksReverted)

                res.status(400).send("Payment denied")
            }

        } catch (e) {
            if (e instanceof APIError) {
                const apiError = e as APIError
                res.status(apiError.code).send(apiError.message)
                logger.error(apiError.message)
                updateState(State.SagaEnded)
            }
        }
    } else {
        res.status(400).send("Payment is invalid")
    }
})


app.use("/api", router)

export default app