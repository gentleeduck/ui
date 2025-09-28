import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { routeMetadata } from './libs/routes'
import { auth_router } from './auth/auth.router'

const app = express()
const PORT = process.env.PORT || 3000

// Security and logging middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  }),
)
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(auth_router)

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Registered ${routeMetadata.length} routes`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`API docs: http://localhost:${PORT}/api/docs`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})
