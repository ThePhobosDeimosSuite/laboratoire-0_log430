import v1Route from './api/v1-route.js'
import basicAuth from 'express-basic-auth'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import cors from 'cors'
import winston from 'winston';
import { ExpressPrometheusMiddleware } from '@matteodisabatino/express-prometheus-middleware'
import { initializeRedisConnection } from './utils/redis-middleware.js'


const app = express()
const PORT = process.env.PORT || 3000

app.use(new ExpressPrometheusMiddleware().handler)


// Logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

app.use((req, res, next) => {
    logger.info(req.url)
    next()
})


// Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    failOnErrors: true,
    info: {
        title: 'Shop API',
        version: '1.0.0',
        description: 'API documentation for LOG430',
    },
    components: {
        securitySchemes: {
            basicAuth: {
                type: 'http',
                scheme: 'basic',
            },
        },
    },
    security: [
        {
            basicAuth: [],
        },
    ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/api/*.ts', './src/api/*.js']
};
const swaggerSpec = swaggerJSDoc(options);

v1Route.use((req, res, next) => {
    // TODO check header for API version
    next()
})

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

app.use(basicAuth({
    users: {
        "admin": "123"
    }
}))

await initializeRedisConnection(process.env.REDIS_URL)

app.use(express.json())
app.use(cors())
app.use("/api", v1Route)

app.listen(PORT, ()=> {
    console.log("Server is running on port " + PORT)
})

export default app
