## Importing generated types

After running `duck-gen`, you can import the generated types in any TypeScript file:

```ts

```

Or from your local output directory:

```ts

```

The package import (`@gentleduck/gen/nestjs`) is recommended because it works consistently
across monorepo setups.

## Typing API calls with Axios

The most immediate use case is typing your HTTP calls. Here is how you would call the
Users API from the previous chapters using plain Axios:

```ts title="client/api/users.ts"

const api = axios.create({ baseURL: 'http://localhost:3000' })

// List users
async function listUsers(query: RouteReq<'/api/users', 'GET'>['query']) {
  const { data } = await api.get
      
      
      <button type="submit">Create User</button>

  )
}
```

If `CreateUserDto` on the server gains a new required field like `role`, re-running
`duck-gen` will cause a TypeScript error in the `useState` initializer because the
initial object is missing the `role` property.

## Next

[Chapter 6: Message Keys](/duck-gen/course/message-keys)