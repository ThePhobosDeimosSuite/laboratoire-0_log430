import { PrismaClient } from "../prisma/generated/prisma/client/client.js"


const dbURL = process.env.DATABASE_URL
const prisma = new PrismaClient({
 datasources: {
    db: {
      url: dbURL
    },
  },
})


export default class ProductService {
    static async addProduct(name: string, price: number, category: string) {
        await prisma.product.create({
            data: {
                name,
                price,
                category
            }
        })
    }

    static async updateProduct(id: number, name: string, price: number, category: string) {
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

    static async searchProduct(id: number | undefined = undefined,
        name: string | undefined = undefined,
        category: string | undefined = undefined,
        shopId: number | undefined = undefined,
        page: number | undefined = undefined,
        size: number | undefined = undefined,
        sort: string[] | undefined = undefined) {
        return await prisma.product.findMany({
            where: {
                id,
                category,
                name
            },
            ...(sort != undefined && {
                orderBy: {
                    [sort[0]]: sort[1]
                }
            }),
            ...(size !== undefined &&
            {
                take: size
            }),
            ...(page !== undefined && size !== undefined &&
            {
                skip: (page - 1) * size,
            }),
            // ...(shopId !== undefined && {
            //     include: {
            //         stock: {
            //             where: {
            //                 shopId
            //             }
            //         }
            //     }
            // })
        })
    }
}