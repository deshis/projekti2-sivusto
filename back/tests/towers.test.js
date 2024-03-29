const supertest = require('supertest')
const app = require('../app')
const schedule = require('node-schedule');

const api = supertest(app)

test('random tower upgrades is array of numbers', async () => {
    const response = await api.get('/api/towers/randomtower')
    const upgradeArray = response.body.upgrades
    expect(Array.isArray(upgradeArray)).toBe(true)
    expect(upgradeArray.every(i => typeof i === "number")).toBe(true)
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

  test('getting towerdata works with valid request', async () => {
    const response = await api.get('/api/towers/towerdata/Dart Monkey')
    .expect(200)

    expect(typeof response.body.type).toBe("string")
    expect(typeof response.body.category).toBe("string")
    expect(typeof response.body.description).toBe("string")
    expect(typeof response.body.image).toBe("string")
    expect(Array.isArray(response.body.upgrades)).toBe(true)
  })

  test('getting towerdata fails with invalid request', async () => {
    await api.get('/api/towers/towerdata/asdasdasd')
    .expect(404)
  })

  test('calculating tower price works with valid request', async () => {
    const response = await api.get('/api/towers/towerprice/Banana Farm/[5,2,0]')
    .expect(200)

    expect(typeof response.body.cost).toBe("number")
    expect(response.body.cost).toBe(125450)
  })

  test('calculating tower price fails with invalid request', async () => {
    await api.get('/api/towers/towerprice/thistowerdoesntexist/[5,2,0]')
    .expect(404)

    await api.get('/api/towers/towerprice/Banana Farm/notalist')
    .expect(400)

    await api.get('/api/towers/towerprice/Banana Farm/["notanumber",2,0]')
    .expect(400)

    await api.get('/api/towers/towerprice/Banana Farm/[6,0,0]')
    .expect(400)

    await api.get('/api/towers/towerprice/Banana Farm/[-1,0,0]')
    .expect(400)
  })

  test('daily tower upgrades is array of numbers', async () => {
    const response = await api.get('/api/towers/daily')
    const upgradeArray = response.body.upgrades
    expect(Array.isArray(upgradeArray)).toBe(true)
    expect(upgradeArray.every(i => typeof i === "number")).toBe(true)
  })

  test('daily tower type is string', async () => {
    const response = await api.get('/api/towers/daily')
    expect(typeof response.body.type).toBe("string")
  })
