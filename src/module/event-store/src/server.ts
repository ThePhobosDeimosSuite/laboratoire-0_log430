import express, { Request, Response } from 'express'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'
import { EventStoreService } from './event-store-service.js'


const app = express()
const router = express.Router()

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())

app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))

const eventStoreService = new EventStoreService()
await eventStoreService.initializeKafka()


router.get('/package/:packageId/state', async (req: Request, res: Response) => {
    const { packageId } = req.params

    res.send(await eventStoreService.getPackageStatus(Number(packageId)))
})




app.use("/api", router)

export default app