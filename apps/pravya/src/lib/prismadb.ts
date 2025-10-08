// import { PrismaClient } from "@prisma/client"
import { prisma } from "@repo/db";

export { prisma }

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log : []
//   })

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
