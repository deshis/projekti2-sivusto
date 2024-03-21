const supertest = require('supertest')
const app = require('../app')
const User = require('../schemas/user')
const Leaderboard = require('../schemas/leaderboard')

const api = supertest(app)


var testUserToken

beforeEach(async () => {
    await User.deleteMany({})

    await Leaderboard.deleteMany({})

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

test('cannot add leaderboard score without token', async () => {
    await api
        .post('/api/daily/leaderboard')
        .send({"score":5})
        .expect(401)
  })

  test('cannot add leaderboard score with bad token', async () => {
    await api
        .post('/api/daily/leaderboard')
        .auth("notarealtoken", { type: 'bearer' })
        .send({"score":5})
        .expect(401)
  })

test('adding a new leaderboard score with valid token works', async () => {
    const response = await api
        .post('/api/daily/leaderboard')
        .auth(testUserToken, { type: 'bearer' })
        .send({"score":5})
        .expect(201)

        expect(response.body.leaderboard.scores).toContainEqual({"score":5, "username":"testaccount"})
  })



test('getting leaderboard scores works', async () => {
    const response = await api
        .get('/api/daily/leaderboard')
        .expect(200)

    expect(Array.isArray(response.body.leaderboard.scores)).toBe(true)
  })


test('getting leaderboard of specific date works', async () => {

    await api
    .post('/api/daily/leaderboard')
    .auth(testUserToken, { type: 'bearer' })
    .send({"score":5})
    .expect(201)

    let today = new Date().getUTCFullYear() + "-" + (new Date().getUTCMonth() + 1) + "-" + new Date().getUTCDate();

    const response = await api
        .get('/api/daily/leaderboard/'+today)
        .expect(200)

    expect(Array.isArray(response.body.leaderboard.scores)).toBe(true)
  })


test('getting leaderboard of date with no leaderboard fails', async () => {

    let badDate = "2000-1-1"
    
    const response = await api
        .get('/api/daily/leaderboard/'+badDate)
        .expect(404)
  })