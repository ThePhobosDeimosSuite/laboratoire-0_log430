import express, { Request, Response } from 'express'
import Manager from '../controller/manager.js'
import StoreEmployee, { ProductSales } from '../controller/store-employee.js'
const router = express.Router()

router.get('/store/:id/sales-report', async (req: Request, res: Response) => {
    const { id } = req.params
    const salesReport = await Manager.getSalesReport(Number(id))

    res.json(salesReport).send()
})

router.get('/store/:id/stock', async (req: Request, res: Response) => {
    const { id } = req.params
    const stocks = await StoreEmployee.getStocks(Number(id))

    res.json(stocks).send()
})

router.get('/store/:id/sales', async (req: Request, res: Response) => {
    const { id } = req.params
    const sales = await StoreEmployee.searchSales(undefined, Number(id))

    res.json(sales).send
})

router.get('/store/:id/sales/:salesId', async (req: Request, res: Response) => {
    const { id, salesId } = req.params
    const sales = await StoreEmployee.searchSales(Number(salesId), Number(id))

    res.json(sales).send
})

router.post('/store/:id/sales', async (req: Request, res: Response) => {
    const { id } = req.params
    const { productSales } = req.body

    if(productSales == undefined || !checkProductSalesType(productSales)) {
        res.status(400).send()
    } else {
        await StoreEmployee.createSales(productSales, Number(id))
        
        res.status(204).send()
    }
})

function checkProductSalesType(productSales: any): boolean {
    if(Array.isArray(productSales)) {
        return productSales.every(p => p.amount != undefined && p.productId != undefined)
    }
    return false
}

router.get('/dashboard', async (req: Request, res: Response) => {
    const dashboard = await Manager.getDashboardView()

    res.json(dashboard).send()
})

router.get('/product', async (req: Request, res: Response) => {
    const { name, id, category } = req.query

    const product = await StoreEmployee.searchProduct(
        id != undefined ? Number(id) : undefined,
        name != undefined ? String(name) : undefined,
        category != undefined ? String(category) : undefined
    )

    res.json(product).send()
})

router.put('/product/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, price, category } = req.body

    if(typeof name != "string" || typeof price != "number" || typeof category != "string") {
        res.status(400).send()
    } else {   
        await Manager.updateProduct(Number(id), name, price, category)
        
        res.status(204).send()
    }
})

router.post('/product', async (req: Request, res: Response) => {
    const { name, price, category } = req.body

    if(typeof name != "string" || typeof price != "number" || typeof category != "string") {
        res.status(400).send()
    } else {   
        await Manager.addProduct(name, price, category)
        
        res.status(204).send()
    }
})




export default router