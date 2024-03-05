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

    let mainPath = Math.floor(Math.random() * 3)
    let crossPath = Math.floor(Math.random() * 3)
    let mainPathTier = Math.floor(Math.random() * 6)
    let crossPathTier = Math.floor(Math.random() * 3)

    
    if(crossPath === mainPath){
        crossPathTier = 0 
    }else if (crossPathTier > mainPathTier){
        crossPathTier = mainPathTier
    }

    let upgrades = [0,0,0]
    
    upgrades[crossPath]=crossPathTier
    upgrades[mainPath]=mainPathTier

    res.status(200).json({
        "type":type,
        "upgrades":upgrades
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