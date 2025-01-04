import { generateId } from 'ai'
import { sql } from 'drizzle-orm'
import {
    boolean,
    date,
    index,
    integer,
    numeric,
    pgTable,
    primaryKey,
    text,
    timestamp,
    varchar,
    vector,
} from 'drizzle-orm/pg-core'

export const resources = pgTable('resources', {
    id: varchar('id', { length: 191 })
        .primaryKey()
        .$defaultFn(() => generateId()),
    content: text('content').notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
})

export const embeddings = pgTable(
    'embeddings',
    {
        id: varchar('id', { length: 191 })
            .primaryKey()
            .$defaultFn(() => generateId()),
        resourceId: varchar('resource_id', { length: 191 }).references(
            () => resources.id,
            { onDelete: 'cascade' }
        ),
        content: text('content').notNull(),
        embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    },
    (table) => ({
        embeddingIndex: index('embeddingIndex').using(
            'hnsw',
            table.embedding.op('vector_cosine_ops')
        ),
    })
)

export const statements = pgTable('statements', {
    id: varchar('id', { length: 191 })
        .primaryKey()
        .$defaultFn(() => generateId()),
    date: date('date'),
    description: text('description'),
    amount: numeric('amount'),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    bankImportId: varchar('bank_import_id', { length: 191 })
        .references(() => bankImports.id, { onDelete: 'cascade' })
        .notNull(),
})

export const bankImports = pgTable('bank_imports', {
    id: varchar('id', { length: 191 })
        .primaryKey()
        .$defaultFn(() => generateId()),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const users = pgTable('users', {
    id: text('id')
        .notNull()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    stripeCustomerId: text('stripeCustomerId').unique(),
    stripeSubscriptionId: text('stripeSubscriptionId').unique(),
    createdAt: timestamp('createdAt').defaultNow(),
})

export const accounts = pgTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const verificationTokens = pgTable(
    'verificationToken',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)

export const authenticators = pgTable(
    'authenticator',
    {
        credentialID: text('credentialID').notNull().unique(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        providerAccountId: text('providerAccountId').notNull(),
        credentialPublicKey: text('credentialPublicKey').notNull(),
        counter: integer('counter').notNull(),
        credentialDeviceType: text('credentialDeviceType').notNull(),
        credentialBackedUp: boolean('credentialBackedUp').notNull(),
        transports: text('transports'),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
)

export const refreshTokens = pgTable('refresh_tokens', {
    token: text('token')
        .notNull()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userId: text('userId')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
})
