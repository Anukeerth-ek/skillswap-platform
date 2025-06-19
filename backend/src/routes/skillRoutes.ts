
import express from 'express'
import {authenticateUser} from '../middleware/authMiddleware'
import { addSkill, listSkills } from '../controllers/skillController'

const router = express.Router()

router.post('/', authenticateUser, addSkill)
router.get('/', listSkills)

export default router;