import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

declare global {
    var db: PostgresJsDatabase<typeof schema> | undefined
}
let db: PostgresJsDatabase<typeof schema>

if (!global.db)
    global.db = drizzle(postgres(process.env.DATABASE_URL!), { schema })

db = global.db

export { db }
