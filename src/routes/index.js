import express from 'express'

import { getUserRoutes } from './user/user.js'
import { getSkillsRoutes } from './skills/skills.js'

export const getAllRoutes = () => {
  // Create a single router for all routes
  const router = express.Router()

  // Add all routes
  router.use('/users', getUserRoutes())
  router.use('/skills', getSkillsRoutes())

  return router
}
