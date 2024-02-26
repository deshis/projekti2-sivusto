const express = require ("express")
const app = express()
const cors = require('cors')
const towerRouter = require('./routers/randomTower')


app.use(cors())

app.use("/api/randomtower", towerRouter)



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
 
module.exports = app