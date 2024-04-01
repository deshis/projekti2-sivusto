const express = require ("express")
const app = express()
const cors = require('cors')
const towers = require('./routers/towers')
const signupRouter = require('./routers/signup')
const loginRouter = require('./routers/login')
const scoreRouter = require('./routers/scores')
const dailyRouter = require('./routers/daily')
const versusRouter = require('./routers/versus')
const path = require('path');

app.use(cors())
app.use(express.json()) 

app.use(express.static(path.join(__dirname, '../front/app/build')));

app.use('/images', express.static('images'))

app.use("/api/towers", towers.towerRouter)
app.use("/api/signup", signupRouter)
app.use("/api/login", loginRouter)
app.use("/api/scores", scoreRouter)
app.use("/api/daily", dailyRouter)
app.use("/api/versus", versusRouter)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
 
module.exports = app