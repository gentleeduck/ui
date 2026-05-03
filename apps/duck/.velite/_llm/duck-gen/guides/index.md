## What you will build

This guide walks you through the full Duck Gen + Duck Query workflow from scratch:

1. A NestJS backend with a `users` module (CRUD routes + messages).
2. Generated types using Duck Gen.
3. A type-safe client using Duck Query.
4. Type-safe i18n translations using generated message types.

By the end, your client code will have **zero manually written types** for API calls,
everything comes from the server source code.

## Step 1: Set up the backend

Start with a NestJS project that has a `users` module.

### DTO (Data Transfer Object)

```ts title="src/modules/users/users.dto.ts"

export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user'),
})

export type CreateUserDto = z.infer

No manual type writing. No drift between server and client. Full type safety from
database to UI.

## Next steps

- [Templates](/docs/templates): another complete example with auth flow.
- [Duck Gen overview](/docs/duck-gen): deep dive into Duck Gen features.
- [Duck Query overview](/docs/duck-query): deep dive into the HTTP client.
- [Configuration](/docs/duck-gen/configuration): customize Duck Gen behavior.