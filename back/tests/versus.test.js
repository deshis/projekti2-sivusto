const supertest = require('supertest')
const app = require('../app')
const User = require('../schemas/user')
const Room = require('../schemas/room')

const api = supertest(app)

var testUserToken
var guyToken

beforeAll (async () => {
    await User.deleteMany({})
    await Room.deleteMany({})

    const newUser = {
        username: 'testaccount',
        password: 'testpassword123!',
    }
    await api
    .post('/api/signup')
    .send(newUser)

    let loginResponse = await api
    .post('/api/login')
    .send(newUser)

    testUserToken = loginResponse.body.token


    const guy = {
        username: 'justsomeguyidk',
        password: 'testpassword123!',
    }
    await api
    .post('/api/signup')
    .send(guy)
    loginResponse = await api
    .post('/api/login')
    .send(guy)
    guyToken = loginResponse.body.token
})


test('randomcode returns code', async () => {
    const response = await api
        .get('/api/versus/randomcode')
        .auth(testUserToken, { type: 'bearer' })
        .expect(200)
    expect(typeof response.body.code).toBe("string")
  })


  test('joining a room succeeds', async () => {
    let response = await api
        .post('/api/versus/join')
        .auth(testUserToken, { type: 'bearer' })
        .send({"code":"12345"})
        .expect(200)

    response = await api
        .post('/api/versus/join')
        .auth(guyToken, { type: 'bearer' })
        .send({"code":"12345"})
        .expect(200)
  })

  test('getting room data of valid room succeeds', async () => {
    const response = await api
        .get('/api/versus/room/12345')
        .auth(testUserToken, { type: 'bearer' })
        .expect(200)
  })

  test('getting invalid room data fails', async () => {
    const response = await api
        .get('/api/versus/room/thisdoesntexist')
        .auth(testUserToken, { type: 'bearer' })
        .expect(404)
  })


  test('adding a guess  succeeds', async () => {
    const response = await api
        .post('/api/versus/guess')
        .send({"code":"12345", "guess":"Dart Monkey"})
        .auth(testUserToken, { type: 'bearer' })
        .expect(201)
    let guess = response.body.guesses[0].guess
     expect(guess).toBe("Dart Monkey")
  })

  test('adding a guess fails when not your turn', async () => {
    const response = await api
        .post('/api/versus/guess')
        .send({"code":"12345", "guess":"Dart Monkey"})
        .auth(testUserToken, { type: 'bearer' })
        .expect(400)
  })

  
  test('adding a chat message succeeds', async () => {
    const response = await api
        .post('/api/versus/room/12345/chat')
        .send({"message":"hello chat"})
        .auth(testUserToken, { type: 'bearer' })
        .expect(201)

    let msg = response.body.messages[0].message
     expect(msg).toBe("hello chat")
  })

  test('getting chat messages succeeds', async () => {
    const response = await api
        .get('/api/versus/room/12345/chat')
        .expect(200)

    let msg = response.body.messages[0].message
     expect(msg).toBe("hello chat")
  })


  test('leaving a room succeeds', async () => {
    let response = await api
        .post('/api/versus/leave')
        .auth(testUserToken, { type: 'bearer' })
        .send({"code":"12345"})
        .expect(200)

    expect(response.body.players.includes("testaccount")).toBe(false)
  })

  test('empty room gets deleted', async () => {
    let response = await api
        .post('/api/versus/leave')
        .auth(guyToken, { type: 'bearer' })
        .send({"code":"12345"})
        .expect(200)

    expect(await Room.findOne({code:"12345"})).toBe(null)
  })