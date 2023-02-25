import express from 'express'
import { 
    registerUser,
    unregisterUser
} from '../../services/registration/registration.service.js'

export const getRegistrationRoutes = () => {
    const router = express.Router()
    router.post('/register/:userID', registerUser)
    router.post('/unregister/:userID', unregisterUser)
    return router
}
