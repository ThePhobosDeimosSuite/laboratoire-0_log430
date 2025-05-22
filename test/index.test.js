const request = require('supertest');
const app = require("../src/app")

describe('GET /Product', () => {
    it('Should return all product', async () => {
        const res = await request(app).get('/product/search')
        expect(res.status).toBe(200)
        expect(res.body[0]).toHaveProperty('id')
        expect(res.body[0]).toHaveProperty('name')
        expect(res.body[0]).toHaveProperty('category')
    })

    it('Should return just fruit', async () => {
        const res = await request(app).get('/product/search?category=Fruit')
        expect(res.status).toBe(200)
        expect(res.body.every(item => item.category == "Fruit")).toBe(true)
    })

    it('Should return first product', async () => {
        const res = await request(app).get('/product/search?id=1')
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(1)
        expect(res.body[0].id).toBe(1)
    })

    it('Should return concombre', async () => {
        const res = await request(app).get('/product/search?name=Comcombre')
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(1)
        expect(res.body[0].name).toBe("Comcombre")
    })
})
    
