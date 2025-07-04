import express, { Request, Response } from 'express'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'
import { EventStoreService } from './event-store-service.js'
import prometheusClient from 'prom-client'


const app = express()
const router = express.Router()

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())

app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))

const register = new prometheusClient.Registry()
const eventCounter = new prometheusClient.Counter({
    name: 'event_consumed_counter',
    help: 'counts the number of consumed event',
    labelNames: ['state']
})
const requestTimeCounter = new prometheusClient.Gauge({
  name: 'last_request_consumed_time',
  help: 'Timestamp of the last request consumed',
  labelNames: ['state']
});

register.registerMetric(eventCounter)
register.registerMetric(requestTimeCounter)

const eventStoreService = new EventStoreService(eventCounter, requestTimeCounter)

router.get('/package/:packageId/state', async (req: Request, res: Response) => {
    const { packageId } = req.params

    res.send(await eventStoreService.getPackageStatus(Number(packageId)))
})


app.use("/api", router)

export default app