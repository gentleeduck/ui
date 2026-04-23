# Dynamic Express Route Scanner

A powerful TypeScript-based system that automatically scans your codebase for routes defined in `routerRegistry` objects and generates a complete Express.js server with full type safety.

## 🚀 Features

- **Automatic Route Discovery**: Scans all `.router.ts` files for routes using `createRoute()`
- **Type-Safe Generation**: Generates comprehensive TypeScript definitions
- **Express Server Generation**: Creates a complete Express.js server with middleware
- **Controller Analysis**: Automatically analyzes controller functions and their signatures
- **Multiple HTTP Methods**: Supports GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
- **Error Handling**: Built-in error handling and logging
- **API Documentation**: Auto-generated API docs endpoint
- **Health Checks**: Built-in health monitoring

## 📁 Project Structure

```
ts_strict/
├── script/
│   ├── advanced-route-scanner.ts    # Main scanner script
│   ├── dynamic-route-scanner.ts     # Basic scanner
│   └── run-scanner.ts              # Runner script
├── server/
│   ├── auth/
│   │   ├── auth.controller.ts      # Controller functions
│   │   ├── auth.router.ts          # Route definitions
│   │   └── auth.dto.ts             # Data validation
│   ├── libs/
│   │   └── routes.ts               # Route utilities
│   └── index.ts                    # Generated Express server
├── index.d.ts                      # Generated type definitions
├── package.json                    # Generated dependencies
└── tsconfig.json                   # TypeScript configuration
```

## 🛠️ Usage

### 1. Run the Route Scanner

```bash
# Using the runner script
bun script/run-scanner.ts

# Or directly
bun script/advanced-route-scanner.ts
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Start the Server

```bash
# Development mode with hot reload
bun run dev

# Or build and run
bun run build
bun run start
```

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/health

# API documentation
curl http://localhost:3000/api/docs

# Your routes (example)
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## 📝 How to Define Routes

### 1. Create a Controller

```typescript
// server/auth/auth.controller.ts
import { returnMessage } from '../libs/response'
import { SigninSchema, signinSchema } from './auth.dto'

export function auth_signin({ data }: { data: SigninSchema }) {
  try {
    const user_data = signinSchema.parse(data)
    return returnMessage(user_data, 'AUTH_SIGNIN_SUCCESS', 'success')
  } catch (error) {
    return returnMessage(null, 'AUTH_SIGNIN_ERROR', 'error')
  }
}
```

### 2. Create a Router

```typescript
// server/auth/auth.router.ts
import { Router } from 'express'
import { createRoute } from '../libs/routes'
import { auth_signin } from './auth.controller'

const auth_router: Router = Router()

// Define routes using createRoute
auth_router.post(...createRoute('/api/auth/signin', auth_signin))
auth_router.get(...createRoute('/api/auth/profile', auth_profile))

export { auth_router }
```

### 3. Define Data Types

```typescript
// server/auth/auth.dto.ts
import z from 'zod'

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type SigninSchema = z.infer<typeof signinSchema>
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### TypeScript Configuration

The scanner generates a `tsconfig.json` with optimal settings for Express development.

## 📊 Generated Files

### `index.d.ts`
- Complete TypeScript definitions for all routes
- Type-safe request/response interfaces
- Route metadata and utility types

### `server/index.ts`
- Complete Express.js server setup
- Dynamic route registration
- Middleware configuration
- Error handling
- Health checks and API docs

### `package.json`
- All necessary dependencies
- Development and production scripts
- TypeScript and build tools

## 🎯 Advanced Features

### Custom Middleware
The scanner can detect and include custom middleware in your routes.

### Parameter Type Inference
Automatically infers parameter types from controller function signatures.

### Return Type Analysis
Analyzes controller return types for better type safety.

### Error Handling
Built-in error handling with proper HTTP status codes.

### Logging
Comprehensive logging with Morgan for request tracking.

### Security
Helmet.js for security headers and CORS configuration.

## 🔍 Troubleshooting

### Common Issues

1. **Handler not found**: Make sure your controller functions are exported
2. **Type errors**: Ensure your DTO types are properly defined
3. **Route not registered**: Check that `createRoute()` is used correctly

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and logging.

## 🚀 Production Deployment

1. Build the project: `bun run build`
2. Set production environment variables
3. Run with PM2 or similar process manager
4. Use reverse proxy (nginx) for SSL and load balancing

## 📈 Performance

- Zero runtime overhead for route registration
- Type-safe at compile time
- Efficient Express.js setup
- Built-in request/response optimization

## 🤝 Contributing

1. Add new route patterns in the scanner
2. Enhance type inference capabilities
3. Add support for additional HTTP methods
4. Improve error handling and logging

## 📄 License

MIT License - feel free to use and modify as needed.
