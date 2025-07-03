import express, { Request, Response } from 'express'
import { ParsedRequest, parseQueryParam, packageState  } from 'shared-utils'
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


router.get('/package/state/:packageId', async (req: Request, res: Response) => {
    const { packageId } = req.params

})




app.use("/api", router)

export default app