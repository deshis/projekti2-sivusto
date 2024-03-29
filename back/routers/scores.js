const jwt = require('jsonwebtoken')
const scoreRouter = require('express').Router()
const config = require('../utils/config')
const User = require('../schemas/user')


scoreRouter.post('/', async (req, res) => {
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

    user.scores.push(req.body)
    await user.save()

    res.status(201)
    res.json({"scores": user.scores})
})

scoreRouter.get('/', async (req, res) => {
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