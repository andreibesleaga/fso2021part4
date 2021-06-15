const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if(body.username.length<3) {
    return response.status(400).json({ error: 'too short username (min 3 chars)' })
  }

  if(body.password.length<6) {
    return response.status(400).json({ error: 'password too short (min 6 chars)' })
  }

  const passwordHash = await bcrypt.hash(body.password, 10)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes:1 })
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter