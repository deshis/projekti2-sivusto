const signupRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../schemas/user')

const specialChars = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/
const numbers = /\d+/ 

signupRouter.post('/', async (req, res) => {
    username = req.body.username
    password = req.body.password
    const saltRounds = 10
    let passwordHash

    try {
        passwordHash = await bcrypt.hash(password, saltRounds) 
    } catch{
        return res.status(400).json({"error":"bcrypt error"})
    }


    if((await User.find({ username: username})).length>0){
        res.status(400)
        res.json({"error":"duplicate username"})
    } 
    else if (username.length<4){
        res.status(400)
        res.json({"error":"username must have at least 4 characters"})
    }
    else if (password.length<6||!(specialChars.test(password)||numbers.test(password))){
        res.status(400)
        res.json({"error":"password must have at least 6 characters and at least one number or special character"})
    }
    else {
        const user = new User({
            username,
            passwordHash,
            daily: false
        })
        const savedUser = await user.save()
        res.status(201)
        res.json(savedUser)
    }


})

module.exports = signupRouter