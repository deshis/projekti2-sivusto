
const dailyRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../schemas/user')


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


const getTokenFrom = request => {
    const authorization = request.get('authorization')  
    if(authorization && authorization.startsWith('Bearer ')){
        return authorization.replace('Bearer ', '')  
    }
  return null
}

module.exports = dailyRouter