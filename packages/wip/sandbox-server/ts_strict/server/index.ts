import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { auth_router } from './auth/auth.router'
import { routeMetadata } from './libs/routes'

const app = express()
const PORT = process.env.PORT || 3000

// Security and logging middleware
app.use(helmet())
app.use(
  cors({
    credentials: true,
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
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
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})
