
const versusRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../schemas/user')
const Room = require('../schemas/room')

const towers = require('./towers')


versusRouter.get('/randomcode', async (req, res) => {
    let randomInt = Math.floor(Math.random() * 99999) + 1;
    let randomString = randomInt.toString().padStart(5, '0');
    res.status(200).json({code:randomString})
})

versusRouter.post('/join', async (req, res) => {
    let code = req.body.code
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

    let room = await Room.findOne({code:code})

    if(!room){
        room = new Room({code:code, turn:user.username, answer:towers.generateTower()})
        await room.save()
    }

    if(room.players.length>=2){
        return res.status(400).json({ error: 'room is full' })
    }

    if(room.players.includes(user.username)){
        return res.status(400).json({ error: 'you have already joined this room' })
    }

    room.players.push(user.username)

    await room.save()

    return res.status(200).json({
        code: room.code,
        players: room.players,
        guesses: room.guesses,
        turn: room.turn
    })

})


versusRouter.post('/leave', async (req, res) => {
    let code = req.body.code
    let decodedToken
    try{
        decodedToken = jwt.verify(getTokenFrom(req), config.SECRET)
    }
    catch(e){
        return res.status(401).json({error: e})
    }
    const user = await User.findById(decodedToken.id)  
    if(user == null){
        return res.status(404).json({error: "user not found"})
    }

    let room = await Room.findOne({code:code})

    if(!room){
        return res.status(400).json({ error: 'this room does not exist' })
    }

    if(!room.players.includes(user.username)){
        return res.status(400).json({ error: 'you are not in this room' })
    }

    let userIndex = room.players.indexOf(user.username);

    room.players.splice(userIndex, 1)

    let playerAmount = room.players.length

    await room.save()

    if(playerAmount<1){
        await Room.deleteOne({code:code});
    }

    return res.status(200).json({
        code: room.code,
        players: room.players,
        guesses: room.guesses,
        turn: room.turn
    })
})



versusRouter.get('/room/:code', async (req, res) => {
    let code = req.params.code

    let room = await Room.findOne({code:code})

    if(!room){
        return res.status(404).json({error: "room does not exist"})
    }

    return res.status(200).json({
        players: room.players,
        guesses: room.guesses,
        turn: room.turn,
        answer: room.answer,
    })

})


versusRouter.post('/guess', async (req, res) => {
    let code = req.body.code
    let guess = req.body.guess

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

    let room = await Room.findOne({code:code})

    if(!room){
        return res.status(404).json({error: "room does not exist"})
    }

    if(!room.players.includes(user.username)){
        return res.status(400).json({ error: 'you are not in this room' })
    }

    if(room.turn!=user.username){
        return res.status(400).json({ error: 'it is not your turn' })
    }


    room.guesses.push({user:user.username, guess:guess})

    let turnIndex = room.turn.indexOf(user.username)

    if(turnIndex==0){
        room.turn=room.players[1]
    }else if(turnIndex==1){
        room.turn=room.players[0]
    }else{
        return res.status(400).json({ error: 'invalid turn index' })
    }


    await room.save()

    return res.status(201).json({
        players: room.players,
        guesses: room.guesses,
        turn: room.turn
    })

})


versusRouter.post('/room/:code/chat', async (req, res) => {
    let code = req.params.code

    let message = req.body.message

    let room = await Room.findOne({code:code})

    if(!room){
        return res.status(404).json({error: "room does not exist"})
    }

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

    room.chat.push({user:user.username, message:message})

    await room.save()

    return res.status(201).json({
        messages: room.chat
    })

})


versusRouter.get('/room/:code/chat', async (req, res) => {
    let code = req.params.code

    let room = await Room.findOne({code:code})

    if(!room){
        return res.status(404).json({error: "room does not exist"})
    }

    return res.status(200).json({
        messages: room.chat
    })

})


const getTokenFrom = request => {
    const authorization = request.get('authorization')  
    if(authorization && authorization.startsWith('Bearer ')){
        return authorization.replaceAll('Bearer ', '')  
    }
  return null
}

module.exports = versusRouter