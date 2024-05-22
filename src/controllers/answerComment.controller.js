import { Posts } from "../models/index.js";
import { FindUser } from './index.js'


// Posting_Answer_Comment
export async function AddAnswerComment(req, res, next) {
    const user = req.user
    const { quesId, ansId } = req.params
    const { body } = req.body

    try {
        if (!user) {
            return res.json({ "message": "Access is denied. Please log in." });
        }

        if (body.trim() === '' || body.lenght < 5) {
            return res.json({ "message": "Comment must be atleast 5 characters long" })
        }

        const existingUser = await FindUser(user._id);
        const question = await Posts.findById(quesId)

        if (!question) {
            return res.json({ "message": `Question with ID: ${quesId} does not exist in DB.` })
        }

        const targetAnswer = question.answers.find(
            (a) => a._id.toString() === ansId
        )

        if (!targetAnswer) {
            return res.json({ "message": `Answer with '${ansId} does not exist in DB'` })
        }

        targetAnswer.comments.push({
            body,
            author: existingUser._id
        })

        question.answers = question.answers.map((a) =>
            a._id.toString() !== ansId ? a : targetAnswer
        )

        await question.save()

        const populatedPost = await Posts.findById(quesId)
            .populate('answers.comments.author', 'username')

        const updatedAnswer = populatedPost.answers.find(
            (a) => a._id.toString() === ansId
        )

        return res.json(updatedAnswer.comments)

    } catch (error) {
        console.log(error);
    }


}




// Deleting_Answer_Comment
export async function DeleteAnswerComment(req, res, body) {
    const user = req.user
    const { quesId, ansId, commentId } = req.params

    try {
        if (!user) {
            return res.json({ "message": "Access is denied. Please log in." });
        }
        const existingUser = await FindUser(user._id);
        const question = await Posts.findById(quesId);



        if (!question) {
            return res.json({ "message": `Question with ID: ${quesId} does not exist in the database` });
        }

        const targetAnswer = question.answers.find(
            (a) => a._id.toString() === ansId
        )

        console.log("targetAnswer.author:", targetAnswer.author);
        console.log("existingUser._id:", existingUser._id);


        if (!targetAnswer) {
            res.json({ "message": `Answer with ID '${ansId} does not exist in DB'` })
        }

        const targetComment = targetAnswer.comments.find(
            (c) => c._id.toString() === commentId
        )

        if (!targetComment) {
            return res.json({ "message": `Comment with ID: '${commentId}' does not exist in DB. ` })
        }

        if (
            targetComment.author.toString() !== existingUser._id.toString()
        ) {
            return res.json({ "message": "Access is denied. You can only delete your own comments." });
        }

        targetAnswer.comments = targetAnswer.comments.filter(
            (c) => c._id.toString() !== commentId
        )

        question.answers = question.answers.map((a) =>
            a._id.toString() !== ansId ? a : targetAnswer
        )

        await question.save();
        return res.json({ "message": "Comment deleted successfully" });

    } catch (error) {
        console.log(error);
    }


}

// Updating_Answer_Comment
export async function UpdateAnswerComment(req, res, next) {
    const user = req.user
    const { quesId, ansId, commentId } = req.params
    const { body } = req.body

    if (body.trim() === '' || body.lenght < 5) {
        return res.json({ "message": "Comment must be atleast 5 characters long" })
    }

    try {
        if (!user) {
            return res.json({ "message": "Access is denied. Please log in." });
        }

        const existingUser = await FindUser(user._id)
        const question = await Posts.findById(quesId)

        if (!question) {
            return res.json({ "message": `Question with ID: ${quesId} does not exist in DB.` })
        }

        const targetAnswer = question.answers.find(
            (a) => a._id.toString() === ansId
        )

        if (!targetAnswer) {
            return res.json({ "message": `Answer with '${ansId} does not exist in DB'` })
        }

        const targetComment = targetAnswer.comments.find(
            (c) => c._id.toString() === commentId
        )


        if (!targetComment) {
            return res.json({ "message": `Comment with ID: '${commentId}' does not exist in DB. ` })
        }

        if (
            targetComment.author.toString() !== existingUser._id.toString()
        ) {
            return res.json({ "message": "Access is denied. You can only delete your own comments." });
        }

        targetComment.body = body
        targetComment.updatedAt = Date.now()

        targetAnswer.comments = targetAnswer.comments.map((c) =>
            c._id.toString() !== commentId ? c : targetComment
        );
        question.answers = question.answers.map((a) =>
            a._id.toString() !== ansId ? a : targetAnswer
        );

        const savedPost = await question.save()
        const PopulatedPost = await Posts.findById(quesId)
            .populate('answers.comments.author', 'name')

        const updatedAnswer = PopulatedPost.answers.find(
            (a) => a._id.toString() === ansId
        )

        return res.json(updatedAnswer.comments)

    } catch (error) {
        console.log(error);
    }
}
