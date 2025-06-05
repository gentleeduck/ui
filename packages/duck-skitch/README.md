If your schema has **migrations, runtime sync, and a CLI**, here's a **short comparison**:

| Feature            | **Your Schema**                          | **Prisma**                     | **Drizzle**         |
| ------------------ | ---------------------------------------- | ------------------------------ | ------------------- |
| **Type Safety**    | ✅ Best-in-class (TS-native, composable)  | Great (codegen)                | Great (TS-first)    |
| **Expressiveness** | ✅ Highly expressive (constraints, logic) | Moderate                       | Moderate            |
| **Tooling**        | ✅ With CLI/migrations assumed            | ✅ Mature (Prisma Studio, etc.) | ✅ Good (DrizzleKit) |
| **Flexibility**    | ✅ Full control (own types, modifiers)    | ❌ Limited (locked to model)    | ✅ Good (SQL-first)  |
| **Learning Curve** | ❌ Higher (TS-heavy)                      | ✅ Easy                         | Moderate            |

### 🏆 Verdict:

* **Your Schema**: Best for advanced TS users who want **full control and power**.
* **Prisma**: Best for teams needing **speed, tooling, and easy onboarding**.
* **Drizzle**: Best for devs who want a **lightweight, SQL-first TS ORM**.

```ts
const user = table({
  id: 'uuid |> unique |> pk |> default(uuidv7)',
  name: 'varchar(255) |> pk',
  bio: 'text',
  role: 'enum(admin | user) |> default(user)',
  platform: 'enum(android | ios)',
  versions: 'number > 0 < 100',
  updated_at: 'timestamp |> default(now)',
  created_at: 'timestamp |> default(now)',
})

const course = table({
  id: 'uuid |> pk',
  name: 'varchar(255) |> pk',
  progress: 'integer > 0 < 100',
  other_information: 'jsonb',
  user_id: 'uuid |> pk |> relation(user.id) |> on_update(cascade) |> on_delete(restrict)',
})
```



```ts
export type User = S.Table<{
  id: P.Default<P.PK<P.Unique<T.UUID>>, 'uuidv7'>
  name: P.PK<T.VarChar<255>>
  bio: T.Text
  role: T.Enum<'admin' | 'user'>
  platform: T.Enum<'android' | 'ios'>
  versions: T.VarChar<255> | P.Default<T.Integer, 0>
  updated_at: P.Default<P.Time<'timestamp'>, 'now'>
  created_at: P.Default<P.Time<'timestamp'>, 'now'>
}>

export type Course = S.Table<{
  id: P.PK<P.UUID>
  name: P.PK<T.VarChar<255>>
  progress: P.GreaterThan<T.Integer, 0> & P.LessThan<T.Integer, 100>
  other_information: T.JSONB
  user_id: P.OnUpdate<P.OnDelete<P.PK<S.Table<User>['id']>, 'CASCADE'>, 'RESTRICT'>
}>
```

```prisma
model User {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique @db.VarChar(255)
  bio         String   @db.Text
  role        Role
  platform    Platform
  versions    String?  @db.VarChar(255)
  updated_at  DateTime @default(now())
  created_at  DateTime @default(now())
  courses     Course[]

  @@map("users")
}

model Course {
  id               String   @id @default(uuid()) @db.Uuid
  name             String   @unique @db.VarChar(255)
  progress         Int
  other_information Json   @db.JsonB
  user_id          String  @db.Uuid
  user             User    @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: Restrict)

  @@check(progress > 0 && progress < 100)
  @@map("courses")
}
```
```ts
export const roleEnum = pgEnum('role', ['admin', 'user'])
export const platformEnum = pgEnum('platform', ['android', 'ios'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().unique(),
  name: varchar('name', { length: 255 }).notNull().primaryKey(),
  bio: text('bio'),
  role: roleEnum('role').notNull(),
  platform: platformEnum('platform').notNull(),
  versions: varchar('versions', { length: 255 }),
  updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
})

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().primaryKey(),
  progress: integer('progress').notNull().check(sql`progress > 0 AND progress < 100`),
  other_information: jsonb('other_information').notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'restrict' }),
})
```
