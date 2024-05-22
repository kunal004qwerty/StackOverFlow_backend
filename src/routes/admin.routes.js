import express from 'express'
import { GetAllUser, Register, GetuserById } from '../controllers/index.js'

const router = express.Router()

//  create_user
router.post("/user", Register)

// get_all_user
router.get("/users", GetAllUser)

// get_user_by_id
router.get('/user/:id', GetuserById)


export { router as AdminRoutes }