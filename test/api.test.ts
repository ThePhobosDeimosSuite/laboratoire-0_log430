import request from 'supertest'
import app from '../src/server.js'

async function addSaladeProduct() {
    const response = await request(app).get('/api/product?name=Salade')
    if(response.body.length == 0) {
        await request(app).post("/api/product").send({
            name: "Salade",
            category: "Légume",
            price: 7
        })
    }
}

describe('Product', () => {
    beforeAll(async () => {
        await addSaladeProduct()
    })

    it('Should return Salade when searching by name', async () => {
        const response = await request(app).get('/api/product?name=Salade')
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
        expect(response.body[0].name).toBe("Salade")
        expect(response.body[0].category).toBe("Légume")
    })

    it('Should return Salade when searching by category', async () => {
        const response = await request(app).get('/api/product?category=Légume')
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
        expect(response.body.some(product => product.name == "Salade")).toBeTruthy()
    })

    it('Should update product', async () => {
        const productId = (await request(app).get('/api/product?name=Salade')).body[0].id
        const productUpdateResponse = await request(app).put("/api/product/" + productId).send({
            name: "Salade",
            category: "Légume",
            price: 100
        })
        expect(productUpdateResponse.status).toBe(204)

        const updatedProduct = await request(app).get('/api/product?id=' + productId)
        expect(updatedProduct.body[0].price).toBe(100)
    })
})

describe('Sales', () => {
    beforeAll(async () => {
        await addSaladeProduct()
    })

    it('Should create new sales', async () => {
        const response = await request(app).post('/api/store/5/sales').send({
            productSales: [
                {
                    productId:1,
                    amount: 40
                }
            ]
        })
        expect(response.status).toBe(204)
    })

    it('Should return error if body is wrongly formatted', async () => {
        const response = await request(app).post('/api/store/5/sales').send({
            productSales: [
                {
                    productI:1,
                    amount: 40
                }
            ]
        })
        expect(response.status).toBe(400)

        const response2 = await request(app).post('/api/store/5/sales').send({
            productSale: [
                {
                    productId:1,
                    amount: "40"
                }
            ]
        })

        expect(response2.status).toBe(400)
    })


    it('Should find new sales', async () => {
        const response = await request(app).get('/api/store/5/sales')
        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })

    it('Should appear in the sales report', async () => {
        const response = await request(app).get('/api/store/5/sales-report')
        expect(response.status).toBe(200)
        expect(response.body.totalSalesPrice).toBeGreaterThan(0)
        expect(response.body.sales.length).toBeGreaterThan(0)
    })

    it('Should apprear on the dashboard', async () => {
        const response = await request(app).get('/api/dashboard')
        expect(response.status).toBe(200)
        expect(response.body.allSalesPerStore['Store 5']).not.toBe("0 $")

    })
})