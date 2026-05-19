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
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user'),
})

export type CreateUserDto = z.infer<typeof createUserSchema>

export const updateUserSchema = createUserSchema.partial()
export type UpdateUserDto = z.infer<typeof updateUserSchema>

export type UserDto = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

export type PaginationDto = {
  page?: number
  limit?: number
  sort?: 'name' | 'email' | 'createdAt'
}
```

### Message constants

```ts title="src/modules/users/users.constants.ts"
/**
 * @duckgen messages users
 */
export const UserMessages = [
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DELETED',
  'USER_NOT_FOUND',
  'USER_EMAIL_TAKEN',
  'USER_LIST_SUCCESS',
] as const
```

Notice the `@duckgen messages users` JSDoc tag. This tells Duck Gen to scan this constant
and register it under the `users` group.

### Response type

```ts title="src/common/types/api.types.ts"
export type ApiResponse<T, M extends string> =
  | { state: 'success'; message: M; data: T }
  | { state: 'error'; message: M; data: null }
```

### Controller

```ts title="src/modules/users/users.controller.ts"
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@nestjs/zod'
import { createUserSchema, updateUserSchema } from './users.dto'
import type { CreateUserDto, UpdateUserDto, UserDto, PaginationDto } from './users.dto'
import type { ApiResponse } from '~/common/types/api.types'
import type { UserMessages } from './users.constants'
import { UsersService } from './users.service'

type UserMessage = (typeof UserMessages)[number]

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async findAll(
    @Query() query: PaginationDto,
  ): Promise<ApiResponse<UserDto[], UserMessage>> {
    const users = await this.service.findAll(query)
    return { state: 'success', message: 'USER_LIST_SUCCESS', data: users }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserDto, UserMessage>> {
    const user = await this.service.findOne(id)
    if (!user) {
      return { state: 'error', message: 'USER_NOT_FOUND', data: null }
    }
    return { state: 'success', message: 'USER_LIST_SUCCESS', data: user }
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
  ): Promise<ApiResponse<UserDto, UserMessage>> {
    const user = await this.service.create(body)
    return { state: 'success', message: 'USER_CREATED', data: user }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto,
  ): Promise<ApiResponse<UserDto, UserMessage>> {
    const user = await this.service.update(id, body)
    return { state: 'success', message: 'USER_UPDATED', data: user }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<ApiResponse<null, UserMessage>> {
    await this.service.remove(id)
    return { state: 'success', message: 'USER_DELETED', data: null }
  }
}
```

## Step 2: Configure Duck Gen

```json title="duck-gen.json"
{
  "$schema": "node_modules/@gentleduck/gen/duck-gen.schema.json",
  "framework": "nestjs",
  "extensions": {
    "shared": {
      "includeNodeModules": false,
      "outputSource": "./generated",
      "sourceGlobs": ["src/**/*.ts"],
      "tsconfigPath": "./tsconfig.json"
    },
    "apiRoutes": {
      "enabled": true,
      "globalPrefix": "/api",
      "normalizeAnyToUnknown": true,
      "outputSource": "./generated"
    },
    "messages": {
      "enabled": true,
      "outputSource": "./generated"
    }
  }
}
```

Make sure your NestJS `main.ts` sets the same prefix:

```ts title="src/main.ts"
const app = await NestFactory.create(AppModule)
app.setGlobalPrefix('api')
await app.listen(3000)
```

## Step 3: Generate types

```bash
bunx duck-gen
```

Output:

```text
> Config loaded
> Processing done
```

Duck Gen now generates types that know about:

* `GET /api/users`: returns `ApiResponse

No manual type writing. No drift between server and client. Full type safety from
database to UI.

## Next steps

* [Templates](/duck-gen/templates): another complete example with auth flow.
* [Duck Gen overview](/duck-gen): deep dive into Duck Gen features.
* [Duck Query overview](/duck-query): deep dive into the HTTP client.
* [Configuration](/duck-gen/configuration): customize Duck Gen behavior.