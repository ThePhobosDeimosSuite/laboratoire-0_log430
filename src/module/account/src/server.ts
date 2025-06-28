import express, { Request, Response } from 'express'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import AccountService from './account-service.js'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'

const app = express()
const router = express.Router()

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())


app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))

/**
 * @swagger
 * /api/account:
 *   post:
 *     description: Add new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Account name
 *               password:
 *                 type: string
 *                 description: Account password
 *     responses:
 *       204:
 *         description: Account added
 *       400:
 *         description: Error in body
 */
router.post('/account', async (req: Request, res: Response) => {
    const { body } = req

    await AccountService.createAccount(body.name, body.password)

    res.status(204).send();
})

/**
 * @swagger
 * /api/account:
 *   get:
 *     description: Get all account
 *     responses:
 *       200:
 *         description: Account
 */
router.get('/account', async (req: Request, res: Response) => {

    const accounts = await AccountService.getAllAccount()

    res.send(accounts);
})


app.use("/api", router)

export default app