import winston from 'winston';
import server from "./server.js"

const PORT = process.env.PORT || 3000

// Logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

server.use((req, res, next) => {
    logger.info(req.url)
    next()
})

server.listen(PORT, ()=> {
    logger.info("Server is running on port " + PORT)
})

export {
  logger
}