const request = require('supertest');
const app = require("../src/app")

describe('GET /Product', () => {
    beforeAll(async () => {
        await request(app).post('/product').send({
                data: {
                    name:"Fraise",
                    stock: 20,
                    price: 3.99,
                    category: "Fruit"
                }
        })
    })

    it('Should return all product', async () => {
        const res = await request(app).get('/product/search')
        console.log(res)
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

    it('Should return Fraise', async () => {
        const res = await request(app).get('/product/search?name=Fraise')
        expect(res.status).toBe(200)
        expect(res.body[0].name).toBe("Fraise")
    })
})
    
