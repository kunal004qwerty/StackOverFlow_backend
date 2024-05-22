import express from 'express'
import { Authenticate } from '../middleware/index.js'
import { GetUserProfile, UpdateUserProfile, UserLogin } from '../controllers/index.js'

const router = express.Router()

// Login_user
router.post('/login', UserLogin)

//----------------------------------
// GEt_User_Profile
// Update_User_Profile
// router.use(Authenticate)
router.get('/profile',Authenticate, GetUserProfile)
router.patch('/profile',Authenticate, UpdateUserProfile)

export {router as UserRoutes}