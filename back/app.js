const express = require ("express")
const app = express()
const cors = require('cors')
const towerRouter = require('./routers/towers')
const signupRouter = require('./routers/signup')
const loginRouter = require('./routers/login')
const scoreRouter = require('./routers/scores')

app.use(cors())
app.use(express.json())

app.use("/api/towers", towerRouter)
app.use("/api/signup", signupRouter)
app.use("/api/login", loginRouter)
app.use("/api/scores", scoreRouter)


app.use('/images', express.static('images'))

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
 
module.exports = app