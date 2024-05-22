import express from 'express'
import { GetAllTags } from '../controllers/index.js'

const router = express.Router()

router.get("/tags", GetAllTags)

export { router as TagRoutes }