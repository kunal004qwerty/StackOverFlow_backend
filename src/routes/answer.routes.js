import express from 'express'
import { Authenticate } from '../middleware/index.js'
import { Add_Answer, Delete_Answer, Edit_Answer, Vote_Answer } from '../controllers/index.js'

const router = express.Router()


// Post_Answer .
router.post("/answer", Authenticate, Add_Answer)

// Delete_answer .
router.delete("/answer",Authenticate, Delete_Answer)

// Edit_Answer .
router.patch("/answer", Authenticate, Edit_Answer)

// Vote_Answer
router.post('/answer/vote',Authenticate, Vote_Answer)

// Accept_Answer

export { router as AnserRoutes }