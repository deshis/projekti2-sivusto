
const dailyRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../schemas/user')
const Leaderboard = require('../schemas/leaderboard')
const schedule = require('node-schedule');


dailyRouter.post('/', async (req, res) => {
    const dailyDone = req.body.daily

    let decodedToken

    try{
        decodedToken = jwt.verify(getTokenFrom(req), config.SECRET)
    }
    catch{
        return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)  

    if(user == null){
        return res.status(404).json({error: "user not found"})
    }

    user.daily = dailyDone
    await user.save()

    res.status(201)
    res.json({"daily": user.daily})
})


dailyRouter.get('/', async (req, res) => {

    let decodedToken

    try{
        decodedToken = jwt.verify(getTokenFrom(req), config.SECRET)
    }
    catch{
        return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)  

    if(user == null){
        return res.status(404).json({error: "user not found"})
    }

    res.status(201)
    res.json({"daily": user.daily})
})


dailyRouter.post('/leaderboard', async (req, res) => {
    const today = new Date().getUTCFullYear() + "-" + (new Date().getUTCMonth() + 1) + "-" + new Date().getUTCDate();

    let decodedToken
    try{
        decodedToken = jwt.verify(getTokenFrom(req), config.SECRET)
    }
    catch{
        return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)  
    if(user == null){
        return res.status(404).json({error: "user not found"})
    }


    let leaderboard = await Leaderboard.findOne({date:today})

    if(!leaderboard){
        leaderboard = new Leaderboard({date:today, scores:[]})
        await leaderboard.save()
    }

    let score = req.body
    score = {
        ...score,
        ...{username:user.username},
      };

    leaderboard.scores.push(score)
    await leaderboard.save()

    res.status(201)
    res.json({"leaderboard": leaderboard})
})



dailyRouter.get('/leaderboard', async (req, res) => {
    const today = new Date().getUTCFullYear() + "-" + (new Date().getUTCMonth() + 1) + "-" + new Date().getUTCDate();

    let leaderboard = await Leaderboard.findOne({date:today})
    if(!leaderboard){
        leaderboard = new Leaderboard({date:today, scores:[]})
        await leaderboard.save()
    }

    res.status(200)
    res.json({"leaderboard": leaderboard})
})

dailyRouter.get('/leaderboard/:date', async (req, res) => {
    const today = req.params.date

    let leaderboard = await Leaderboard.findOne({date:today})
    if(!leaderboard){
        leaderboard = new Leaderboard({date:today, scores:[]})
        await leaderboard.save()
    }

    res.status(200)
    res.json({"leaderboard": leaderboard})
})


const getTokenFrom = request => {
    const authorization = request.get('authorization')  
    if(authorization && authorization.startsWith('Bearer ')){
        return authorization.replace('Bearer ', '')  
    }
  return null
}

module.exports = dailyRouter