import express, { Request, Response } from 'express'
import winston from 'winston';
import { ParsedRequest, parseQueryParam } from 'utils'
import StocksService from './stocks-service.js';

const app = express()
const router = express.Router()
const PORT = process.env.PORT || 3000

// Logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

app.use((req, res, next) => {
    logger.info(req.url)
    next()
})


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



app.use('/', router)

app.listen(PORT, ()=> {
    logger.info("Server is running on port " + PORT)
})