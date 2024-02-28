const supertest = require('supertest')
const app = require('../app')
const User = require('../schemas/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const newUser = {
    username: 'testaccount',
    password: 'testpassword123!',
}
  await api
  .post('/api/signup')
  .send(newUser)
  
})

test('Login works with correct username and password', async () => {

    const newUser = {
        username: 'testaccount',
        password: 'testpassword123!',
    }
    await api
        .post('/api/login')
        .send(newUser)
        .expect(200)
  })

  test('Login fails with incorrect password', async () => {
    const newUser = {
      username: 'testaccount',
      password: 'wrongpassword',
  }
  await api
      .post('/api/login')
      .send(newUser)
      .expect(401)
  })

  test('Login fails with nonexistent account', async () => {
    const newUser = {
      username: 'thisaccountdoesnotexist',
      password: 'testpassword123!',
  }
  await api
      .post('/api/login')
      .send(newUser)
      .expect(401)
  })