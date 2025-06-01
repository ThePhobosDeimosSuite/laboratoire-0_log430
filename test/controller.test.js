import Manager from '../src/controller/manager'

describe('Product', () => {
    beforeAll(async () => {
        await Manager.addProduct("Melon", 5, "Fruit")
    })

    it("Should find melon", async () => {
        const res = await Manager.searchProduct(undefined, "Melon")
        expect(res.length).toBeGreaterThan(0)
        expect(res[0].name).toBe("Melon")
        expect(res[0].price).toBe(5)
        expect(res[0].category).toBe("Fruit")
    })

    it("Should not find concombre", async () => {
        const res = await Manager.searchProduct(undefined, "Conbombre")
        expect(res.length).toBe(0)
    })
})

describe('Sales', () => {
    beforeAll(async () => {
        await Manager.createSales([{
            productId: 1,
            amount: 5
        }], 5)
    })

    it('Should find sales', async () => {
        const res = await Manager.searchSales(undefined, 5)
        expect(res.length).toBeGreaterThan(0)
        expect(res[0].totalPrice).toBe(25)
        expect(res[0].productSales[0].amount).toBe(5)
    })
})

describe('Orders', () => {
    beforeAll(async () => {
        await Manager.addOrder(1, 5, 5)
    })

    it('Should find the order', async ()=> {
        const res = await Manager.getOrder()
        expect(res.find(r => r.productId == 1 && r.shopId == 5 && r.amount == 5)).toBeTruthy()
    })

    
    it('Should delete the order', async ()=> {
        await removeOrder(1, 5)
        const res = await Manager.getOrder()
        expect(res.find(r => r.productId == 1 && r.shopId == 5 && r.amount == 5)).toBeFalsy()
    })
})