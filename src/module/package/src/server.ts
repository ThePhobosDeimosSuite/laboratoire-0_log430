import express, { Request, Response } from 'express'
import { packageState } from 'shared-utils'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'
import PackageService from './package-service.js'
import prometheusClient from 'prom-client'


const app = express()
const router = express.Router()

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())

app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))

const register = new prometheusClient.Registry()
const eventCounter = new prometheusClient.Counter({
    name: 'event_created_counter',
    help: 'counts the number of created event',
    labelNames: ['state']
})
const requestTimeCounter = new prometheusClient.Gauge({
  name: 'last_request_created_time',
  help: 'Timestamp of the last request created',
  labelNames: ['state']
});

register.registerMetric(eventCounter)
register.registerMetric(requestTimeCounter)


let packageService: PackageService
async function getPackageService() {
    if(!packageService) {
        packageService = new PackageService(eventCounter, requestTimeCounter)
        await packageService.initializeKafka()
    }
    return packageService
}


router.post('/package/:packageId', async (req: Request, res: Response) => {
    const { packageId } = req.params
    const { state } = req.body

    if(state && Object.values(packageState).includes(state)) {
        const service = await getPackageService()
        await service.sendPackageUpdate(Number(packageId), state as packageState)
        res.send("Event sent!")
    } else {
        res.status(400).send("State is invalid.")
    }
})




app.use("/api", router)

export default app