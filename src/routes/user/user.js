import express from 'express'

import { 
    getAllUsers, 
    getUser, 
    updateUser, 
} from "../../services/user/user.service.js"

const getUserRoutes = () => {
    const router = express.Router()

    // Assign the handlers for each of our endpoints
    router.get('/', getAllUsers)
    router.get('/:userID', getUser)
    router.put('/:userID', updateUser)
    return router
}

export { getUserRoutes }
