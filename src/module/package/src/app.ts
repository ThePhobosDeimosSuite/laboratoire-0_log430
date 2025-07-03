import { logger } from 'shared-utils'
import server from "./server.js"

const PORT = process.env.PORT || 3000

server.use((req, res, next) => {
    logger.info(req.url)
    next()
})

server.listen(PORT, ()=> {
    logger.info("Server is running on port " + PORT)
})