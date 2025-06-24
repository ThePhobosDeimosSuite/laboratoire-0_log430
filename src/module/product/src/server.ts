import express, { Request, Response } from 'express'
import winston from 'winston';
import ProductService from './product-service.js'
import { ParsedRequest, parseQueryParam } from './api-utils.js' // TODO share this across different module
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'


const app = express()
const router = express.Router()
const PORT = process.env.PORT || 3000

app.use(new ExpressPrometheusMiddleware().handler)

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

app.use(express.json())

/**
 * @swagger
 * /api/product:
 *   post:
 *     description: Add new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               category:
 *                 type: string
 *                 description: Category of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *     responses:
 *       204:
 *         description: Product added
 *       400:
 *         description: Error in body
 */
router.post('/product', async (req: Request, res: Response) => {
    const { name, price, category } = req.body

    if(typeof name != "string" || typeof price != "number" || typeof category != "string") {
        res.status(400).send()
    } else {   
        await ProductService.addProduct(name, price, category)
        
        res.status(204).send()
    }
})

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     description: Update product
 *     parameters: 
 *       - name: id
 *         in: path
 *         description: Product Id
 *         type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               category:
 *                 type: string
 *                 description: Category of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *     responses:
 *       204:
 *         description: Product updated
 *       400:
 *         description: Error in body
 */
router.put('/product/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, price, category } = req.body

    if(typeof name != "string" || typeof price != "number" || typeof category != "string") {
        res.status(400).send()
    } else {   
        await ProductService.updateProduct(Number(id), name, price, category)
        
        res.status(204).send()
    }
})

/**
 * @swagger
 * /api/product:
 *   get:
 *     description: Search for product
 *     parameters: 
 *       - name: name
 *         in: query
 *         description: Product name
 *         type: integer
 *         required: false
 *       - name: id
 *         in: query
 *         description: Product Id
 *         type: integer
 *         required: false
 *       - name: category
 *         in: query
 *         description: Product category
 *         type: integer
 *         required: false
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
 *         example: name,asc
 *     responses:
 *       200:
 *         description: Product 
 *       400:
 *         description: Error in body
 */
router.get('/product', parseQueryParam, async (req: ParsedRequest, res: Response) => {
    const { page, size, sort } = req.parsedQuery
    const { name, id, category } = req.query

    const product = await ProductService.searchProduct(
        id != undefined ? Number(id) : undefined,
        name != undefined ? String(name) : undefined,
        category != undefined ? String(category) : undefined, 
        undefined,
        page,
        size,
        sort
    )

    res.json(product).send()
})

app.use("/api", router)

app.listen(PORT, ()=> {
    logger.info("Server is running on port " + PORT)
})

export default app