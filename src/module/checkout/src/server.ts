import express, { Request, Response } from 'express'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import CheckoutService from './checkout-service.js'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'

const app = express()
const router = express.Router()

app.use(new ExpressPrometheusMiddleware().handler)
const checkoutService = new CheckoutService()
checkoutService.initializeKafka()

app.use(express.json())

app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))


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
    const { storeId, clientId } = req.params
    console.log(`storeId: ${storeId} clientId :${clientId}`)
    await checkoutService.checkoutSale(Number(storeId), Number(clientId))
    res.status(204).send()
})


app.use("/api", router)

export default app