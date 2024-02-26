const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../schemas/user')

loginRouter.post('/', async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const user = await User.findOne({ username })

  if (!user) {
    res.status(401)
    res.json({
      error: 'nonexistent username'
    })
  } else if(!await bcrypt.compare(password, user.passwordHash)){
    res.status(401)
    res.json({
      error: 'incorrect password'
    })
  } else {
    const tokenUser = {
        username: user.username,
        id: user._id,
    }
    
    const token = jwt.sign(tokenUser, process.env.SECRET)

    res
        .status(200)
        .json({username: user.username, token})
  }


})

module.exports = loginRouter