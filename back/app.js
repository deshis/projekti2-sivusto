const express = require ("express")
const app = express()
const cors = require('cors')
const towerRouter = require('./routers/randomTower')
const signupRouter = require('./routers/signup')

app.use(cors())
app.use(express.json())

app.use("/api/randomtower", towerRouter)
app.use("/api/signup", signupRouter)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
 
module.exports = app