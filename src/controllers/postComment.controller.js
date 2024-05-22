import { Comments, Posts } from "../models/index.js"
import { FindUser } from "./index.js"
import mongoose from "mongoose";



// ---------- Commnets_On_Posts

// add_commnet_On_post
export async function AddPostComment(req, res, next) {
    const user = req.user
    const { quesId, body } = req.body

    if (body.trim() === '' || body.lenght < 5) {
        return res.json({ "message": "Comment must be atleast 5 characters long" })
    }

    try {
        if (user) {
            const existingUser = await FindUser(user._id)
            const post = await Posts.findById(quesId)


            if (!post) {
                return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` })
            }


            post.comments.push({
                body,
                author: existingUser._id
            })

            await post.save();

            const populatedPost = await Posts.findById(quesId)
                .populate('comments.author', 'name');

            return res.json(populatedPost.comments);

        } else {
            return res.json({ "message": "Access is denied" })

        }

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }

}

// Delete_Commnet_On_pOst
export async function DeleteQuesComment(req, res, next) {
    const user = req.user;
    const { quesId, commentId } = req.params;
    // console.log("quesId:", quesId);
    // console.log("commentId:", commentId);

    try {
        if (!user) {
            return res.json({ "message": "Access is denied. Please log in." });
        }

        const existingUser = await FindUser(user._id);
        const question = await Posts.findById(quesId);

        if (!question) {
            return res.json({ "message": `Question with ID: ${quesId} does not exist in the database` });
        }

        const targetComment = question.comments.find(
            (c) => c._id.toString() === commentId
        );

        if (!targetComment) {
            return res.json({ "message": `Comment with ID: ${commentId} does not exist in the database` });
        }

        if (targetComment.author.toString() !== existingUser._id.toString()) {
            return res.json({ "message": "Access is denied. You can only delete your own comments." });
        }

        question.comments = question.comments.filter(
            (c) => c._id.toString() !== commentId
        );

        await question.save();
        return res.json({ "message": "Comment deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An error occurred while deleting the comment." });
    }
}



// Edit_Commnet_On_Post
export async function EditQuesComment(req, res, next) {
    const user = req.user
    const { quesId, commentId } = req.params
    const { body } = req.body

    console.log(req.body);
 


    if (body.trim() === '' || body.lenght < 5) {
        return res.json({ "message": "Comment must be atleast 5 characters long" })
    }
 

    try {
        if (user) {
            const existingUser = await FindUser(user._id)
            const post = await Posts.findById(quesId)

            // if (existingUser) {
            //     return res.json(existingUser)
            // }


            if (!post) {
                return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` })
            }

            const targetComment = post.comments.find(
                (c) => c._id.toString() === commentId
            )

            console.log("targetComment", targetComment);

            if (!targetComment) {
                return res.json({ "message": `Comment with ID: ${commentId} does not exist in database` })
            }

            if (
                targetComment.author.toString() !== existingUser.id.toString()
            ) {
                return res.json({ "message": "Access is denied" })
            }


            targetComment.body = body
            targetComment.updatedAt = Date.now()

            post.comments = post.comments.map((c) =>
                c._id.toString() !== commentId ? c : targetComment
            )

            const savedPost = await post.save();

            // Populate comments' author field
            const populatedPost = await Posts.findById(quesId)
                .populate('comments.author', 'name');

            // console.log("populatedQues", populatedPost);

            return res.json(populatedPost.comments);

        } else {
            return res.json({ "message": "Access is denied" })

        }

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }


}

// for testing -->
export async function GetAllComments(req, res, next) {
    try {
        const response = await Comments.find()
        return res.json(response)
    } catch (error) {
        console.log(error);
    }
}


// export async function DeleteQuesComment(req, res, next) {
//     const user = req.user;
//     const { quesId, commentId } = req.body;

//     try {
//         if (user) {
//             const existingUser = await FindUser(user._id);
//             const question = await Posts.findById(quesId);

//             if (!question) {
//                 return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` });
//             }

//             const targetCommentIndex = question.commnents.findIndex(
//                 (c) => c._id.toString() == commentId
//             );

//             if (targetCommentIndex === -1) {
//                 return res.json({ "message": `Comment with ID: ${commentId} does not exist in the database` });
//             }

//             const targetComment = question.comments[targetCommentIndex];

//             if (targetComment.author._id.toString() !== existingUser._id.toString()) {
//                 return res.json({ "message": "Access is denied" });
//             }

//             question.comments.splice(targetCommentIndex, 1);

//             await question.save();
//             return res.json({ "message": "Comment deleted successfully" });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: error.message });
//     }
// }
