import request from 'supertest'
import salesServer from '../src/server.js'
import { Server } from 'http'

let server: Server

describe('Sales', () => {
    beforeAll(() => {
        server = salesServer.listen(0)
    })

    afterAll(() => {
        server.close()
    })

    it('Should create new sales', async () => {
        const response = await request(salesServer).post('/api/store/5/sales').send({
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
        const response = await request(salesServer).post('/api/store/5/sales').send({
            productSales: [
                {
                    productI:1,
                    amount: 40
                }
            ]
        })
        expect(response.status).toBe(400)

        const response2 = await request(salesServer).post('/api/store/5/sales').send({
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
        const response = await request(salesServer).get('/api/store/5/sales')
        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })

    // it('Should appear in the sales report', async () => {
    //     const response = await request(salesServer).get('/api/store/5/sales-report')
    //     expect(response.status).toBe(200)
    //     expect(response.body.totalSalesPrice).toBeGreaterThan(0)
    //     expect(response.body.sales.length).toBeGreaterThan(0)
    // })

    // it('Should apprear on the dashboard', async () => {
    //     const response = await request(salesServer).get('/api/dashboard')
    //     expect(response.status).toBe(200)
    //     expect(response.body.allSalesPerStore['Store 5']).not.toBe("0 $")
    // })
})