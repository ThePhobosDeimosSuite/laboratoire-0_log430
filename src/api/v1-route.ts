import express, { Request, Response } from 'express'
import Manager from '../controller/manager.js'
import StoreEmployee from '../controller/store-employee.js'
const router = express.Router()

/**
 * @swagger
 * /api/store/{id}/sales-report:
 *   get:
 *     description: Get shop sales report
 *     parameters: 
 *       - name: id
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Sales report
 */
router.get('/store/:id/sales-report', async (req: Request, res: Response) => {
    const { id } = req.params
    const salesReport = await Manager.getSalesReport(Number(id))

    res.json(salesReport).send()
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
 *     responses:
 *       200:
 *         description: Stocks
 */
router.get('/store/:id/stock', async (req: Request, res: Response) => {
    const { id } = req.params
    const { page, size } = req.query
    const stocks = await StoreEmployee.getStocks(Number(id), 
        page != undefined ? Number(page) : undefined,
        size != undefined ? Number(size) : undefined)

    res.json(stocks).send()
})

/**
 * @swagger
 * /api/store/{id}/sales:
 *   get:
 *     description: Get sales for shop
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
 *     responses:
 *       200:
 *         description: Sales
 */
router.get('/store/:id/sales', async (req: Request, res: Response) => {
    const { id } = req.params
    const { page, size } = req.query
    const sales = await StoreEmployee.searchSales(undefined, Number(id),
        page != undefined ? Number(page) : undefined,
        size != undefined ? Number(size) : undefined)
    res.json(sales).send()
})

/**
 * @swagger
 * /api/store/{id}/sales/{salesId}:
 *   get:
 *     description: Get sales for shop
 *     parameters: 
 *       - name: id
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *       - name: salesId
 *         in: path
 *         description: sales ID
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
 *     responses:
 *       200:
 *         description: Sales
 */

router.get('/store/:id/sales/:salesId', async (req: Request, res: Response) => {
    const { id, salesId } = req.params
    const { page, size } = req.query
    const sales = await StoreEmployee.searchSales(Number(salesId), Number(id),
        page != undefined ? Number(page) : undefined,
        size != undefined ? Number(size) : undefined)

    res.json(sales).send()
})

/**
 * @swagger
 * /api/store/{id}/sales:
 *   post:
 *     description: Create new sales for shop
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
 *       - name: id
 *         in: path
 *         description: Store ID
 *         type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Sales added
 *       400:
 *         description: Error in body
 * 
 */
router.post('/store/:id/sales', async (req: Request, res: Response) => {
    const { id } = req.params
    const { productSales } = req.body

    if(productSales == undefined || !checkProductSalesType(productSales)) {
        res.status(400).send()
    } else {
        await StoreEmployee.createSales(productSales, Number(id))
        
        res.status(204).send()
    }
})

function checkProductSalesType(productSales: any): boolean {
    if(Array.isArray(productSales)) {
        return productSales.every(p => p.amount != undefined && p.productId != undefined)
    }
    return false
}

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     description: Get dashboard view
 *     responses:
 *       200:
 *         description: Dashboard
 */
router.get('/dashboard', async (req: Request, res: Response) => {
    const dashboard = await Manager.getDashboardView()

    res.json(dashboard).send()
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
 *     responses:
 *       200:
 *         description: Product 
 */
router.get('/product', async (req: Request, res: Response) => {
    const { name, id, category, size, page } = req.query

    const product = await StoreEmployee.searchProduct(
        id != undefined ? Number(id) : undefined,
        name != undefined ? String(name) : undefined,
        category != undefined ? String(category) : undefined, 
        undefined,
        page != undefined ? Number(page) : undefined,
        size != undefined ? Number(size) : undefined
    )

    res.json(product).send()
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
        await Manager.updateProduct(Number(id), name, price, category)
        
        res.status(204).send()
    }
})


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
        await Manager.addProduct(name, price, category)
        
        res.status(204).send()
    }
})




export default router