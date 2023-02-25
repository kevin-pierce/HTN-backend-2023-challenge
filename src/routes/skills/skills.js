import express from 'express'
import { getSkills } from '../../services/skills/skills.service.js'

export const getSkillsRoutes = () => {
    const router = express.Router()

    // Assign the handlers for each of our endpoints
    router.get('/', getSkills)
    return router
}
