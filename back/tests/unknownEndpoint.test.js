const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('unknown endpoint returns 404', async () => {
    await api
        .get('/this/does/not/exist')
        .expect(404)
})
