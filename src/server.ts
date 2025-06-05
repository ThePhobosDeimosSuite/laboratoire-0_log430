import v1Route from './api/v1-route.js'
import basicAuth from 'express-basic-auth'
import express from 'express'
const app = express()
const PORT = 3000


v1Route.use((req, res, next) => {
    // TODO check header for API version
    next()
})

app.use(basicAuth({
    users: {
        "admin": "123"
    }
}))

app.use(express.json())
app.use("/api", v1Route)

app.listen(PORT, ()=> {
    console.log("Server is running on port " + PORT)
})
