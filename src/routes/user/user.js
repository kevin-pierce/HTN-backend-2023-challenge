import express from 'express'
import { 
    getAllUsers, 
    getUser, 
    updateUser, 
    getRegistrationStatus
} from "../../services/user/user.service.js"

export const getUserRoutes = () => {
    const router = express.Router()

    // Assign the handlers for each of our endpoints
    router.get('/', getAllUsers)
    router.get('/:userID', getUser)
    router.put('/:userID', updateUser)
    router.get('/:userID/registration', getRegistrationStatus)
    return router
}
