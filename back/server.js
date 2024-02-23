const express = require ("express")
const app = express()
const cors = require('cors')
app.use(cors())

app.get("/api/hello", (req, res)=>{
    res.json({
        "testdata":"hello"
    })
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})