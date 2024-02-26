const supertest = require('supertest')
const app = require('../app')
const User = require('../schemas/user')
const mongoose = require('mongoose')

const api = supertest(app)

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

beforeEach(async () => {
    await User.deleteMany({})
})

test('creating new account succeeds', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
        username: 'validusername',
        password: 'ValidPassword123!',
    }

    await api
        .post('/api/signup')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
})

test('creating new account with invalid username fails', async () => {
    const usersAtStart = await usersInDb()
    
    const newUser = {
        username: 'a',
        password: 'ValidPassword123!',
    }
    
    await api
        .post('/api/signup')
        .send(newUser)
        .expect(400)
    
    const usersAtEnd = await usersInDb()
    
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
})
    
test('creating new account with invalid password fails', async () => {
    const usersAtStart = await usersInDb()
    
    const newUser = {
        username: 'validusername',
        password: 'a',
    }
    
    await api
        .post('/api/signup')
        .send(newUser)
        .expect(400)
    
    const usersAtEnd = await usersInDb()
    
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
})

afterAll(async () => {
    await mongoose.connection.close()
})