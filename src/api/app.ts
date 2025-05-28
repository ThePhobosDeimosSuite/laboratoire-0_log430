// const express = require("express")
// const app = express()
// import { Request, Response, NextFunction, Express } from 'express'
// import { PrismaClient } from '@prisma/client'
// const bodyParser = require('body-parser')

// const prisma = new PrismaClient()

// app.use(express.json())
// app.use(bodyParser.json())


// app.post("/product", async (req: Request, res: Response) => {
//     const { data } = req.body
//     await prisma.product.create({
//         data 
//     })
//     res.status(201).send()
// })

// app.get("/product/search", async (req: Request, res: Response) => {
//     const name = req.query.name?.toString()
//     const category = req.query.category?.toString()
//     const id = req.query.id && Number(req.query.id)

//     const products = await prisma.product.findMany({
//         where: {
//             id: id == "" ? undefined : id,
//             category,
//             name,
//         }
//     })
//     res.send(products)
// })

// app.get("/sales/:id", async (req: Request, res: Response) => {
//     const id = req.params.id && Number(req.params.id)
//     res.send(await getSales(id == "" ? undefined : id))
// })


// app.get("/sales", async (req: Request, res: Response) => {
//     res.send(await getSales(undefined))
// })


// async function getSales(id: number | undefined) {
//     const sales = await prisma.sales.findMany({
//         where:{
//             id,
//         },
//         include:{
//             productSales: {
//                 include: {
//                     product:true
//                 }
//             }
//         }
//     })

//     // Add total amount
//     const response =  sales.map(r => ({
//         ...r,
//         totalPrice: r.productSales
//             .map(p => p.amount * p.product.price)
//             .reduce((partialSum,a) => partialSum + a, 0)
//     }))
//     return response
// }

// app.post("/sales", async (req: Request, res: Response) => {
//     const { data } = req.body

//     // Reduce the stock after a sale
//     for(const product of data) {
//         await prisma.product.update({
//             where: {
//                 id: product.productId
//             },
//             data: {
//                 stock: {
//                     decrement: product.amount
//                 }
//             }
//         })
//     }
    
//     await prisma.sales.create({
//         data:{
//             productSales: {
//                 create: data
//             },
//             shopId:1
//         }
//     })
//     res.status(201).send()
// })

// app.post("/sales/:id/cancel", async (req: Request, res: Response) => {
//     const id = Number(req.params.id)

//     await prisma.sales.update({
//         where: {
//             id
//         }, 
//         data: {
//             isCancelled: true
//         }
//     })
//     res.send()
// })

// app.get("/stocks", async (req: Request, res: Response) => {
//     const response = await prisma.product.findMany({
//         select: {
//             name: true,
//             stock: true
//         }
//     })

//     res.send(response)
// })

// module.exports = app
