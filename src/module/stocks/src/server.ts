import express, { Response } from 'express'
import { ParsedRequest, parseQueryParam } from 'shared-utils'
import StocksService from './stocks-service.js';
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'

const app = express()
const router = express.Router()

const stocksService = new StocksService()
// await stocksService.initializeKafka()

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())

app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))


/**
 * @swagger
 * /api/store/{id}/stock:
 *   get:
 *     description: Get stocks for shop
 *     parameters: 
 *       - name: id
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *       - name: page
 *         in: query
 *         description: Page number
 *         type: integer
 *         required: false
 *       - name: size
 *         in: query
 *         description: Page size
 *         type: integer
 *         required: false
 *       - name: sort
 *         in: query
 *         description: Sort
 *         required: false
 *         example: amount,asc
 *     responses:
 *       200:
 *         description: Stocks
 *       400:
 *         description: Error with query params (page, size and sort)
 */
router.get('/store/:id/stock', parseQueryParam, async (req: ParsedRequest, res: Response, next) => {
  // cacheStocks
  const { id } = req.params
  const { page, size, sort } = req.parsedQuery
  const stocks = await stocksService.getStocks(
    Number(id),
    undefined,
    page,
    size,
    sort)

  res.json(stocks).send()
})


/**
 * @swagger
 * /api/store/{id}/order:
 *   get:
 *     description: Get orders for shop
 *     parameters: 
 *       - name: id
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *       - name: page
 *         in: query
 *         description: Page number
 *         type: integer
 *         required: false
 *       - name: size
 *         in: query
 *         description: Page size
 *         type: integer
 *         required: false
 *       - name: sort
 *         in: query
 *         description: Sort
 *         required: false
 *         example: amount,asc
 *     responses:
 *       200:
 *         description: Orders
 *       400:
 *         description: Error with query params (page, size and sort)
 */
router.get('/store/:id/order', async (req: ParsedRequest, res: Response, next) => {
  const { id } = req.params
  const orders = await stocksService.getOrder(
    Number(id))

  res.json(orders).send()
})


/**
 * @swagger
 * /api/store/{id}/stock:
 *   post:
 *     description: Create new stocks for shop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - amount
 *             properties:
 *               productId:
 *                 type: number
 *                 description: Id of product
 *               amount:
 *                 type: number
 *                 description: Amount of product   
 *               decrement:
 *                 type: boolean
 *                 description: True to decrement stocks  
 *               increment:
 *                 type: boolean
 *                 description: True to increment stocks              
 *     parameters: 
 *       - name: id
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Stocks added
 *       400:
 *         description: Error in body
 * 
 */
router.post('/store/:storeId/stock', async (req: ParsedRequest, res: Response, next) => {
  const { storeId } = req.params
  const { productId, amount, decrement, increment } = req.body
  if (decrement) {
    await stocksService.decrementStocks(productId, amount, Number(storeId))
  } else if(increment) {
    await stocksService.incrementStocks(productId, amount, Number(storeId))
  } else {
    await stocksService.addStocks(productId, amount, Number(storeId))
  }
  res.status(204).send()
})


/**
 * @swagger
 * /api/store/{id}/order:
 *   post:
 *     description: Create new order for shop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - amount
 *             properties:
 *               productId:
 *                 type: number
 *                 description: Id of product
 *               amount:
 *                 type: number
 *                 description: Amount of product                 
 *     parameters: 
 *       - name: id
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Order added
 *       400:
 *         description: Error in body
 * 
 */
router.post('/store/:id/order', async (req: ParsedRequest, res: Response, next) => {
  const { id } = req.params
  const { productId, amount } = req.body
  await stocksService.addOrder(
    productId,
    amount,
    Number(id),
  )

  res.status(204).send()
})

app.use("/api", router)

export default app