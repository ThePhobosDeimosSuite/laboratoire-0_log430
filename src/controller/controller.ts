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

export async function updateProduct(id: number, name: string, price: number, category: string) {
    await prisma.product.update({
        where: {
            id
        },
        data: {
            name,
            price,
            category
        }
    })
}

export async function searchProduct(id: number | undefined = undefined, 
    name: string | undefined = undefined, 
    category: string | undefined = undefined, 
    shopId: number | undefined = undefined) {
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
        await decrementStocks(product.productId, product.amount, shopId)
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

// export async function getAllSales() {
//     return await prisma.sales.findMany()
// }

export async function searchSales(id: number | undefined, shopId: number) {
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

export async function getStocks(shopId:number, productId:number | undefined = undefined) {
    return await prisma.stock.findMany({
        where: {
            productId,
            shopId
        }, 
        include: {
            product:true
        }
    })
}

export async function addStocks(productId:number, amount: number, shopId:number) {
    await prisma.stock.upsert({
        where: {
            productId_shopId: {
                productId,
                shopId
            }
        },
        update: { // Increase stock if row already exists
            amount: {
                increment: amount
            }
        },
        create: { // Create row if doesn't exist
            productId,
            amount,
            shopId
        }
    })
}

export async function decrementStocks(productId: number, amount: number, shopId: number) {
    await prisma.stock.updateMany({
        where: {
            shopId,
            productId
        },
        data: {
            amount: {
                decrement: amount
            }
        }
    })
}

export async function addOrder(productId: number, amount: number, shopId: number) {
    await prisma.order.create({
        data: {
            amount,
            shopId,
            productId
        }
    })
}

export async function getOrder() {
    return await prisma.order.findMany({
        include: {
            product: true
        }
    })
} 

export async function removeOrder(productId: number, shopId: number) {
    return await prisma.order.delete({
        where: {
            productId_shopId: {
                productId,
                shopId
            } 
        }
    })
} 