import { PrismaClient } from "../prisma/generated/prisma/client/client.js"


const dbURL = process.env.DATABASE_URL
const prisma = new PrismaClient({
 datasources: {
    db: {
      url: dbURL
    },
  },
})

export default class AccountService {
    static async createAccount(name:string, password: string) {
        await prisma.account.create({
            data: {
                name,
                password
            }
        })
    }

    static async getAllAccount() {
        return await prisma.account.findMany()
    }
}