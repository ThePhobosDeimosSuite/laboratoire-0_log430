import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function addProduct(name: string, price: number, category: string) {
    await prisma.product.create({
        data: {
            name,
            price,
            category
        }
    })
}

export async function searchProduct(id: number | undefined, name: string | undefined, category: string | undefined, shopId: number) {
    return await prisma.product.findMany({
        where: {
            id,
            category,
            name
        }, 
        include : {
            stock: {
                where: {
                    shopId
                }
            }
        }
    })
}

export async function createSales(productSales: {productId: number, amount: number}[], shopId: number) {
    // Reduce the stock after a sale
    for(const product of productSales) {
        await prisma.stock.updateMany({
            where: {
                shopId,
                productId: product.productId
            },
            data: {
                amount: {
                    decrement: product.amount
                }
            }
        })
    }
    
    await prisma.sales.create({
        data:{
            productSales: {
                create: productSales
            },
            shopId
        }
    })
}

export async function searchSales(id: number, shopId: number) {
    const sales = await prisma.sales.findMany({
        where:{
            id,
            shopId
        },
        include:{
            productSales: {
                include: {
                    product:true
                }
            }
        }
    })

    // Add total amount
    const response =  sales.map(r => ({
        ...r,
        totalPrice: r.productSales
            .map(p => p.amount * p.product.price)
            .reduce((partialSum,a) => partialSum + a, 0)
    }))
    return response
}

export async function cancelSales(id: number, shopId: number) {
    await prisma.sales.update({
        where: {
            id,
            shopId
        }, 
        data: {
            isCancelled: true
        }
    })
}

export async function getStocks(shopId:number) {
    return await prisma.stock.findMany({
        where: {
            shopId
        }
    })
}

export async function addStocks(productId:number, amount: number, shopId:number){
    await prisma.stock.create({
        data: {
            productId,
            amount,
            shopId
        }
    })
}