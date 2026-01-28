import { PrismaNeon } from '@prisma/adapter-neon'
import path from 'node:path'
import { defineConfig } from 'prisma/config'

// import your .env file
import 'dotenv/config'

export default defineConfig({
    experimental: {
        adapter: true,
    },
    schema: path.join('prisma', 'schema.prisma'),
    async adapter() {
        return new PrismaNeon({
            connectionString: process.env.DATABASE_URL!,
        })
    }
})