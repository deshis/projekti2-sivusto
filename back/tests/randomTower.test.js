const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('tower tier is between 0-5', async () => {
    const response = await api.get('/api/randomtower')
    expect(response.body.tier).toBeGreaterThanOrEqual(0)
    expect(response.body.tier).toBeLessThanOrEqual(5)
  })

  test('tower path is between 1-3', async () => {
    const response = await api.get('/api/randomtower')
    expect(response.body.path).toBeGreaterThanOrEqual(1)
    expect(response.body.path).toBeLessThanOrEqual(3)
  })

  test('tower type is string', async () => {
    const response = await api.get('/api/randomtower')
    expect(typeof response.body.type).toBe("string")
  })