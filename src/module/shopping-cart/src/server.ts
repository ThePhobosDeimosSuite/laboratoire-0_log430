import express, { Request, Response } from 'express'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import ShoppingCartService from './shopping-cart-service.js'
import { isProductSalesType } from 'shared-utils'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'

const app = express()
const router = express.Router()

app.use(new ExpressPrometheusMiddleware().handler)

const shoppingCartService = new ShoppingCartService()

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
 *       204:
 *         description: Shopping cart added
 *       400:
 *         description: Error in body
 * 
 */
router.post('/store/:storeId/client/:clientId/cart', async (req: Request, res: Response) => {
    const { storeId, clientId } = req.params
    const { productSales } = req.body

    if (productSales == undefined || !isProductSalesType(productSales)) {
        res.status(400).send()
    } else {
        try {
            await shoppingCartService.addItemsToCart(productSales, Number(storeId), Number(clientId))
            res.status(204).send()
        } catch (e) {
            res.status(409).send()
        }
    }
})

/**
 * @swagger
 * /api/store/:storeId/client/:clientId/cart:
 *   delete:
 *     description: Delete shopping cart for shop and client
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
 *         description: Shopping cart removed
 * 
 */
router.delete('/store/:storeId/client/:clientId/cart', async (req: Request, res: Response) => {
    const { storeId, clientId } = req.params

    await shoppingCartService.deleteCart(Number(storeId), Number(clientId))
    res.status(204).send()
})

 /** 
 * @swagger
 * /api/store/:storeId/client/:clientId/cart:
 *   get:
 *     description: Get shopping cart for shop and client
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
 *         description: Shopping cart
 *       404:
 *         description: Shopping cart doesn't exist
 */
router.get('/store/:storeId/client/:clientId/cart', async (req: Request, res: Response) => {
    const { storeId, clientId } = req.params
    const cart = await shoppingCartService.getCart(Number(storeId), Number(clientId))

    if(cart) {
        res.send(cart)
    } else {
        res.status(404).send()
    }
})


app.use("/api", router)

export default app