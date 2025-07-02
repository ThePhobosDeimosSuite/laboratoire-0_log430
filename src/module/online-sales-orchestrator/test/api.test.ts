import { Server } from 'http';
import request from 'supertest'
import onlineSalesOrchestrator from '../src/server.js'
import nock from 'nock'

let onlineSalesOrchestratorServer: Server;

const storeId = 1
const clientId = 1
const saladeProductId = 1


describe('Orchestrator', () => {
    beforeEach(() => {
        nock(process.env.PRODUCT_SERVICE_URL)
            .get("/api/product?id=" + saladeProductId)
            .reply(200,
                [
                    {
                        id: 1,
                        name: "concombre",
                        price: 7,
                        category: "légume"
                    }
                ]
            )

        nock(process.env.STOCKS_SERVICE_URL)
            .get(`/api/store/${storeId}/stock`)
            .reply(200, [
                {
                    productId: 1,
                    amount: 10,
                    shopId: 1
                }
            ])
            .post(`/api/store/${storeId}/stock`)
            .reply(204)

        nock(process.env.SALES_SERVICE_URL)
            .post(`/api/store/${storeId}/sales`)
            .reply(204)

        nock(process.env.SHOPPING_CART_SERVICE_URL)
            .post(`/api/store/${storeId}/client/${clientId}/cart`)
            .reply(204)
            .get(`/api/store/${storeId}/client/${clientId}/cart`)
            .reply(200, {
                productSales: [
                    {
                        productId: 1,
                        amount: 2
                    }
                ]
            })
            .get(`/api/store/${storeId + 1}/client/${clientId}/cart`)
            .reply(404)
            .delete(`/api/store/${storeId}/client/${clientId}/cart`)
            .reply(204)
    })
    beforeAll(async () => {
        onlineSalesOrchestratorServer = onlineSalesOrchestrator.listen(0);
    })
    afterAll(() => {
        onlineSalesOrchestratorServer.close()
    })

    it('Should cancel if not enough stocks', async () => {
        const response = await request(onlineSalesOrchestratorServer).post(`/api/store/${storeId}/client/${clientId}/cart`).send({
            productSales: [
                {
                    productId: saladeProductId,
                    amount: 200
                }
            ]
        })

        expect(response.status).toBe(400)
    })


    it('Should cancel if no stocks', async () => {
        const response = await request(onlineSalesOrchestratorServer).post(`/api/store/${storeId}/client/${clientId}/cart`).send({
            productSales: [
                {
                    productId: saladeProductId + 1,
                    amount: 2
                }
            ]
        })

        expect(response.status).toBe(400)
    })

    it('Should create shopping cart', async () => {
        const response = await request(onlineSalesOrchestratorServer).post(`/api/store/${storeId}/client/${clientId}/cart`).send({
            productSales: [
                {
                    productId: saladeProductId,
                    amount: 2
                }
            ]
        })

        expect(response.status).toBe(200)
    })

    it('Should cancel if trying to checkout without a shopping cart', async () => {
        const response = await request(onlineSalesOrchestratorServer).post(`/api/store/${storeId + 1}/client/${clientId}/cart/checkout`).send({
            payment: 10
        })

        expect(response.status).toBe(404)
    })

    it('Should cancel if checkout amount is too low', async () => {
        const response = await request(onlineSalesOrchestratorServer).post(`/api/store/${storeId}/client/${clientId}/cart/checkout`).send({
            payment: 10
        })
        expect(response.status).toBe(400)
    })

    it('Should checkout', async () => {
        const response = await request(onlineSalesOrchestratorServer).post(`/api/store/${storeId}/client/${clientId}/cart/checkout`).send({
            payment: 20
        })

        expect(response.status).toBe(200)
    })
})
