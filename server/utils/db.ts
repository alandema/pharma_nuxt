import { PrismaClient } from '~prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const config = useRuntimeConfig()
const adapter = new PrismaNeon({ connectionString: config.databaseUrl })
export const prisma = new PrismaClient({ adapter })