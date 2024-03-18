const supertest = require('supertest')
const app = require('../app')
const User = require('../schemas/user')

const api = supertest(app)

var testUserToken

beforeEach(async () => {
    await User.deleteMany({})

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
})



test('cannot set daily without token', async () => {
    await api
        .post('/api/daily')
        .send({"daily":false})
        .expect(401)
  })

  test('cannot set daily with bad token', async () => {
    await api
        .post('/api/daily')
        .auth("notarealtoken", { type: 'bearer' })
        .send({"daily":false})
        .expect(401)
  })

test('setting daily with valid token works', async () => {
    const response = await api
        .post('/api/daily')
        .auth(testUserToken, { type: 'bearer' })
        .send({"daily":true})
        .expect(201)

    expect(response.body.daily).toBe(true)
  })
