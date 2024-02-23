const express = require ("express")
const app = express()
const cors = require('cors')
app.use(cors())

app.get("/api/randomtower", (req, res)=>{
    const towers = [
    "Dart Monkey",
    "Boomerang Monkey",
    "Bomb Shooter",
    "Tack Shooter",
    "Ice Monkey",
    "Glue Gunner",
    "Sniper Monkey",
    "Monkey Sub",
    "Monkey Buccaneer",
    "Monkey Ace",
    "Heli Pilot",
    "Mortar Monkey",
    "Dartling Gunner",
    "Wizard Monkey",
    "Super Monkey",
    "Ninja Monkey",
    "Alchemist",
    "Druid",
    "Banana Farm",
    "Spike Factory",
    "Monkey Village",
    "Engineer Monkey",
    "Beast Handler"
    ]
    let type = towers[Math.floor(Math.random() * towers.length)]
    let tier = Math.floor(Math.random() * 6);
    let path = Math.floor(Math.random() * 3)+1;
    res.json({
        "type":type,
        "tier":tier,
        "path":path
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