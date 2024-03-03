const towerRouter = require('express').Router()
const Tower = require('../schemas/tower')

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

towerRouter.get('/randomtower', async (req, res) => {
    let type = towers[Math.floor(Math.random() * towers.length)]
    let tier = Math.floor(Math.random() * 6);
    let path = Math.floor(Math.random() * 3)+1;

    res.status(200).json({
        "type":type,
        "tier":tier,
        "path":path
    })
})

towerRouter.get('/', async (req, res) => {
    res.status(200).json({
        "towers":towers
    })
})

towerRouter.get('/towerdata/:name', async (req, res) => {
    const name = req.params.name
    let towerData = await Tower.findOne({"type":name})
    if(towerData){
        res.status(200).json(towerData)
    }else{
        res.status(404).json({"error":"tower not found"})
    }
})

module.exports = towerRouter