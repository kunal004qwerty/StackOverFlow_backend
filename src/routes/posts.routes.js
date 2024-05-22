import express from 'express'
import { Authenticate } from '../middleware/index.js'
import { AddPost, PostById, GetAllPost, DeletePostById, EditPostById, VoteQuestion } from '../controllers/index.js'



const router = express.Router()

// post_a_question .
// router.use(Authenticate)
router.post("/post",Authenticate, AddPost)

// delete_Question  .
router.delete("/post/:id", Authenticate, DeletePostById)

// Edit_question  .
router.patch("/post/:id",Authenticate, EditPostById)

// Vote_question  .
router.post("/post/vote",Authenticate, VoteQuestion)

// Get_all_Post .
router.get("/post", GetAllPost)

// Get_Post_By_id .
router.get("/post/:id", PostById)

export { router as PostRoutes }