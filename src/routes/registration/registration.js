import express from 'express'
import { 
    registerUser,
    unregisterUser
} from '../../services/registration/registration.service.js'

export const getRegistrationRoutes = () => {
    const router = express.Router()

    // Assign the handlers for each of our endpoints
    router.post('/register/:userID', registerUser)
    router.post('/unregister/:userID', unregisterUser)
    return router
}
