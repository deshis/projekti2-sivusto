const towerRouter = require('express').Router()
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

towerRouter.get('/', async (req, res) => {
    let type = towers[Math.floor(Math.random() * towers.length)]
    let tier = Math.floor(Math.random() * 6);
    let path = Math.floor(Math.random() * 3)+1;
    res.json({
        "type":type,
        "tier":tier,
        "path":path
    })
})

module.exports = towerRouter