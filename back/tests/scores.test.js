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

test('cannot add score without token', async () => {
    await api
        .post('/api/scores')
        .send({"score":5})
        .expect(401)
  })

  test('cannot add score with bad token', async () => {
    await api
        .post('/api/scores')
        .auth("notarealtoken", { type: 'bearer' })
        .send({"score":5})
        .expect(401)
  })

test('adding a new score with valid token works', async () => {
    const response = await api
        .post('/api/scores')
        .auth(testUserToken, { type: 'bearer' })
        .send({"score":5})
        .expect(201)

    expect(response.body.scores).toContainEqual(5)
  })





  
test('cannot get scores without token', async () => {
    await api
        .get('/api/scores')
        .expect(401)
  })

  test('cannot get scores with bad token', async () => {
    await api
        .get('/api/scores')
        .auth("notarealtoken", { type: 'bearer' })
        .expect(401)
  })

test('getting scores with valid token works', async () => {
    const response = await api
        .get('/api/scores')
        .auth(testUserToken, { type: 'bearer' })
        .expect(200)
    expect(Array.isArray(response.body.scores)).toBe(true)
  })

