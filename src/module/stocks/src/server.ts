import express, { Request, Response } from 'express'
import winston from 'winston';
import { ParsedRequest, parseQueryParam } from 'shared-utils'
import StocksService from './stocks-service.js';
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'

const app = express()
const router = express.Router()
const PORT = process.env.PORT || 3000

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())


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
  const stocks = await StocksService.getStocks(
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
  const orders = await StocksService.getOrder(
    Number(id))

  res.json(orders).send()
})

router.post('/store/:id/stock', async (req: ParsedRequest, res: Response, next) => {
  const { id } = req.params
  const { productId, amount } = req.body
  await StocksService.addStocks(
    productId,
    amount,
    Number(id),
  )

  res.status(204).send()
})

router.post('/store/:id/order', async (req: ParsedRequest, res: Response, next) => {
  const { id } = req.params
  const { productId, amount } = req.body
  await StocksService.addOrder(
    productId,
    amount,
    Number(id),
  )

  res.status(204).send()
})




app.use("/api", router)

export default app