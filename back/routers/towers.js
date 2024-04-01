const towerRouter = require('express').Router()
const Tower = require('../schemas/tower')
const schedule = require('node-schedule');
const User = require('../schemas/user')

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

let generateTower = function(){
    let type = towers[Math.floor(Math.random() * towers.length)]

    let mainPath = Math.floor(Math.random() * 3)
    let crossPath = Math.floor(Math.random() * 3)
    let mainPathTier = Math.floor(Math.random() * 6)
    let crossPathTier = Math.floor(Math.random() * 3)

    if(crossPath === mainPath){
        crossPathTier = 0 
    } else if (crossPathTier > mainPathTier){
        crossPathTier = mainPathTier
    }

    let upgrades = [0,0,0]
    
    upgrades[crossPath]=crossPathTier
    upgrades[mainPath]=mainPathTier

    return {"type":type,"upgrades":upgrades}
}


let dailyTower = generateTower()

//new random daily tower every day at 00:00 UTC 
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = 'Etc/UTC';
const job = schedule.scheduleJob(rule, async function(){
  dailyTower = generateTower()

    //reset user dailies to false
    const users = await User.find({})
    users.forEach(async (user) => {
        user.daily=false
        await user.save()
    })

}) 


towerRouter.get('/randomtower', async (req, res) =>{
    res.status(200).json(generateTower())
})

towerRouter.get('/daily', async (req, res) => {
    res.status(200).json(dailyTower)
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


towerRouter.get('/towerprice/:name/:upgrades', async (req, res) => {
    const name = req.params.name

    let upgradesToCalculate

    try{
        upgradesToCalculate = JSON.parse(req.params.upgrades)
    }catch{
        return res.status(400).json({"error":"failed to parse upgrade array"})
    }

    let towerData = await Tower.findOne({"type":name})

    if(!(Array.isArray(upgradesToCalculate)&&upgradesToCalculate.every(i => typeof i === "number"))){
        return res.status(400).json({"error":"upgrades is not array of numbers"})
    }
    if(upgradesToCalculate.some(i => i>5||i<0)){
        return res.status(400).json({"error":"upgrade tier invalid"})
    }

    if(!towerData){
        res.status(404).json({"error":"tower not found"})
    }
    else{
        const upgrades = towerData.upgrades
        let totalPrice = towerData.cost
        for(let i=0; i<3;i++){
            for(let j=0; j<upgradesToCalculate[i];j++){
                totalPrice+=upgrades[i][j].cost
            }
        }
        res.status(200).json({"cost":totalPrice})
    }
})

module.exports = {
    towerRouter, 
    generateTower
}