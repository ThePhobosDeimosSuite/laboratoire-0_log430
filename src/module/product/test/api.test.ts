import request from 'supertest'
import productServer from '../src/server.js'
import { Server } from 'http';

let server: Server;

async function addSaladeProduct() {
    const response = await request(productServer).get('/api/product?name=Salade')
    if(response.body.length == 0) {
        await request(productServer).post("/api/product").send({
            name: "Salade",
            category: "Légume",
            price: 7
        })
    }
}

describe('Product', () => {
    beforeAll(async () => {
        server = productServer.listen(0);
        await addSaladeProduct()
    })
    afterAll(() => {
        server.close()
    })

    it('Should return Salade when searching by name', async () => {
        const response = await request(productServer).get('/api/product?name=Salade')
        console.log(response)
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
        expect(response.body[0].name).toBe("Salade")
        expect(response.body[0].category).toBe("Légume")
    })

    it('Should return Salade when searching by category', async () => {
        const response = await request(productServer).get('/api/product?category=Légume')
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
        expect(response.body.some(product => product.name == "Salade")).toBeTruthy()
    })

    it('Should update product', async () => {
        const productId = (await request(productServer).get('/api/product?name=Salade')).body[0].id
        const productUpdateResponse = await request(productServer).put("/api/product/" + productId).send({
            name: "Salade",
            category: "Légume",
            price: 100
        })
        expect(productUpdateResponse.status).toBe(204)

        const updatedProduct = await request(productServer).get('/api/product?id=' + productId)
        expect(updatedProduct.body[0].price).toBe(100)
    })
})