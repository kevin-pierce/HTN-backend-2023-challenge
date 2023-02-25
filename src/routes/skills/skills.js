import express from 'express'
import { getSkills } from '../../services/skills/skills.service.js'

export const getSkillsRoutes = () => {
    const router = express.Router()
    router.get('/', getSkills)
    return router
}
