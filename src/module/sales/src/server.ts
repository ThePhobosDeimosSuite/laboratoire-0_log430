import express, { Request, Response } from 'express'
import { ParsedRequest, parseQueryParam } from 'shared-utils'
import SalesService from './sales-service.js';
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'

const app = express()
const router = express.Router()
const PORT = process.env.PORT || 3000

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())


// /**
//  * @swagger
//  * /api/store/{id}/sales-report:
//  *   get:
//  *     description: Get shop sales report
//  *     parameters: 
//  *       - name: id
//  *         in: path
//  *         description: Store ID
//  *         type: integer
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: Sales report
//  */
// router.get('/store/:id/sales-report', async (req: Request, res: Response) => {
//     // cacheSales
//     const { id } = req.params
//     const salesReport = await SalesService.getSalesReport(Number(id))
//     res.json(salesReport).send()
// })


function checkProductSalesType(productSales: any): boolean {
    if(Array.isArray(productSales)) {
        return productSales.every(p => p.amount != undefined && p.productId != undefined)
    }
    return false
}

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
    // cacheSales
    const { id } = req.params
    const { productSales } = req.body

    if(productSales == undefined || !checkProductSalesType(productSales)) {
        res.status(400).send()
    } else {
        await SalesService.createSales(productSales, Number(id))
        
        res.status(204).send()
    }
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
 *       - name: sort
 *         in: query
 *         description: Sort
 *         required: false
 *         example: id,asc
 *     responses:
 *       200:
 *         description: Sales
 *       400:
 *         description: Error with query params (page, size and sort)
 */
router.get('/store/:id/sales', parseQueryParam, async (req: ParsedRequest, res: Response) => {
    // cacheSales
    const { id } = req.params
    const { page, size, sort } = req.parsedQuery
    const sales = await SalesService.searchSales(undefined, Number(id),
        page,
        size,
        sort)
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
 *       - name: sort
 *         in: query
 *         description: Sort
 *         required: false
 *         example: id,asc
 *     responses:
 *       200:
 *         description: Sales
 *       400:
 *         description: Error with query params (page, size and sort)
 */

router.get('/store/:id/sales/:salesId', parseQueryParam, async (req: ParsedRequest, res: Response) => {
    // cacheSales
    const { id, salesId } = req.params
    const { page, size, sort } = req.parsedQuery
    const sales = await SalesService.searchSales(Number(salesId), Number(id),
        page,
        size,
        sort)

    res.json(sales).send()
})

// /**
//  * @swagger
//  * /api/dashboard:
//  *   get:
//  *     description: Get dashboard view
//  *     responses:
//  *       200:
//  *         description: Dashboard
//  */
// router.get('/dashboard', async (req: Request, res: Response) => {
//     const dashboard = await SalesService.getDashboardView()

//     res.json(dashboard).send()
// })


app.use("/api", router)

export default app