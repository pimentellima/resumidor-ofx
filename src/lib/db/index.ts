import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import '../env-config'
import * as schema from './schema'

let db: PostgresJsDatabase<typeof schema>
let pg: ReturnType<typeof postgres>

if (process.env.NODE_ENV === 'production') {
    pg = postgres(process.env.DATABASE_URL!, { prepare: false })
    db = drizzle(pg, { schema })
} else {
    if (!(global as any).database!) {
        pg = postgres(process.env.DATABASE_URL!, { prepare: false })
        ;(global as any).database = drizzle(pg, { schema })
    }
    db = (global as any).database
}

export { db, pg }
