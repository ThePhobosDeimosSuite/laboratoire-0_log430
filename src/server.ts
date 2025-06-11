import v1Route from './api/v1-route.js'
import basicAuth from 'express-basic-auth'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import cors from 'cors'
import winston from 'winston';
import promBundle from 'express-prom-bundle'
import promClient from 'prom-client'

const app = express()
const PORT = 3000

// Prometheus
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const counter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(counter);

const responseTimeHistogram = new promClient.Histogram({
  name: 'http_response_time_seconds',
  help: 'HTTP response time in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5], // Response time buckets
});
register.registerMetric(responseTimeHistogram);

app.use((req, res, next) => {
  const end = responseTimeHistogram.startTimer()
  res.on('finish', () => {
    counter.labels(req.method, req.path, res.statusCode.toString()).inc();
    end({ method: req.method, route: req.route ? req.route.path : req.path, status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// const metricsMiddleware = promBundle({includeMethod: true, includePath: true, includeStatusCode: true})
// app.use(metricsMiddleware);

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

// app.use(basicAuth({
//     users: {
//         "admin": "123"
//     }
// }))


app.use(express.json())
app.use(cors())
app.use("/api", v1Route)

app.listen(PORT, ()=> {
    console.log("Server is running on port " + PORT)
})

export default app
