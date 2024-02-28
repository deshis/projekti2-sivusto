const jwt = require('jsonwebtoken')
const scoreRouter = require('express').Router()
const config = require('../utils/config')
const User = require('../schemas/user')

var decodedToken

scoreRouter.post('/', async (req, res) => {
    try{
        decodedToken = jwt.verify(getTokenFrom(req), config.SECRET)
    }
    catch{
        return res.status(401).json({ error: 'token invalid' })
    }
    
    const user = await User.findById(decodedToken.id)  
    user.scores.push(req.body.score)
    await user.save()

    res.status(201)
    res.json({"scores": user.scores})
})

scoreRouter.get('/', async (req, res) => {
    try{
        decodedToken = jwt.verify(getTokenFrom(req), config.SECRET)
    }
    catch{
        return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)  

    res.status(200)
    res.json({"scores": user.scores})
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')  
    if(authorization && authorization.startsWith('Bearer ')){
        return authorization.replace('Bearer ', '')  
    }
  return null
}

module.exports = scoreRouter