import { Router } from 'express'
import { createRoute } from '../libs/routes'
import { auth_signin, auth_signout, auth_signup } from './auth.controller'

const auth_router: Router = Router()

auth_router.post(...createRoute('/api/auth/signin', auth_signin))
auth_router.post(...createRoute('/api/auth/signup', auth_signup))
auth_router.post(...createRoute('/api/auth/signout', auth_signout))

export { auth_router }
