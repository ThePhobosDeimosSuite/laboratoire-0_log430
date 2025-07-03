import express, { Request, Response } from 'express'
import { ParsedRequest, parseQueryParam, packageState  } from 'shared-utils'
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import swagger from './swagger.js'
import SwaggerUiExpress from 'swagger-ui-express'
import PackageService from './package-service.js'


const app = express()
const router = express.Router()

app.use(new ExpressPrometheusMiddleware().handler)

app.use(express.json())

app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swagger))

let packageService: PackageService
async function getPackageService() {
    if(!packageService) {
        packageService = new PackageService()
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
    } else {
        res.status(400).send("State is invalid.")
    }
})




app.use("/api", router)

export default app