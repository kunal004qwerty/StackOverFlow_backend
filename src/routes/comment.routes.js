import express from 'express'
import { AddPostComment, DeleteQuesComment, EditQuesComment, AddAnswerComment, DeleteAnswerComment, UpdateAnswerComment } from '../controllers/index.js'
import { Authenticate } from '../middleware/index.js'


const router = express.Router()

// add_post_comments
router.post('/post/comment', Authenticate, AddPostComment)


// Delete_Ques_Comment
router.delete('/questions/:quesId/comments/:commentId', Authenticate, DeleteQuesComment)

// Edit_Ques_Comment
router.patch('/questions/:quesId/comments/:commentId', Authenticate, EditQuesComment)

// for testing
// router.get('/post/comment', (req, res) => {
//     const response = {
//       message: "Hello from the testing route!"
//     };
//     res.json(response);
//   });


// add_answer_comments
router.post('/questions/:quesId/answers/:ansId/comments', Authenticate, AddAnswerComment)


// Delete_Ans_comments
router.delete('/questions/:quesId/answers/:ansId/comments/:commentId', Authenticate, DeleteAnswerComment)

// Edit_Ans_Comments
router.patch('/questions/:quesId/answers/:ansId/comments/:commentId', Authenticate, UpdateAnswerComment)


export { router as CommentsRoutes }