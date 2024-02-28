  const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('random tower tier is between 0-5', async () => {
    const response = await api.get('/api/towers/randomtower')
    expect(response.body.tier).toBeGreaterThanOrEqual(0)
    expect(response.body.tier).toBeLessThanOrEqual(5)
  })

  test('random tower path is between 1-3', async () => {
    const response = await api.get('/api/towers/randomtower')
    expect(response.body.path).toBeGreaterThanOrEqual(1)
    expect(response.body.path).toBeLessThanOrEqual(3)
  })

  test('random tower type is string', async () => {
    const response = await api.get('/api/towers/randomtower')
    expect(typeof response.body.type).toBe("string")
  })

  test('towers is array of strings', async () => {
    const response = await api.get('/api/towers')

    const towerArray = response.body.towers
    expect(Array.isArray(towerArray)).toBe(true)
    expect(towerArray.every(i => typeof i === "string")).toBe(true)
  })