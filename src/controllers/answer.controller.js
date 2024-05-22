import { Answers, Posts } from '../models/index.js'
import { downvoteIt, upvoteIt ,ansRep} from '../utility/index.js'
import { FindUser } from './index.js'

// Post_Answer .
export async function Add_Answer(req, res, next) {
    const { quesId, body } = req.body
    const user = req.user

    try {
        if (user) {
            const existingUser = await FindUser(user._id)
            const question = await Posts.findById(quesId)

            if (!question) {
                return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` })
            }

            question.answers.push({
                author: user._id,
                body,
            })

            const SavePost = await question.save()
            const populateQues = await Posts.findById(quesId)
                .populate('author', 'name')
                .populate('answers.author', 'name')
                .populate('answers.comments.author', 'name')
            // .execPopulate()


            existingUser.answers.push({
                ansId: SavePost.answers[SavePost.answers.length - 1]._id
            })

            await existingUser.save()

            return res.json(populateQues)

        } else {
            return res.json({ "message": "Login First" })

        }


    } catch (error) {
        console.log(error);
    }

}

// Delete_Answer .
export async function Delete_Answer(req, res, next) {
    const { quesId, ansId } = req.body
    const user = req.user

    try {
        if (user) {
            const existingUser = await FindUser(user._id)
            const question = await Posts.findById(quesId)

            if (!question) {
                return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` })
            }

            const targetAnswer = question.answers.find(
                (a) => a._id.toString() === ansId
            )
            if (!targetAnswer) {
                return res.json({ "message": `Answer with Id ${ansId} does not exist in DB` })
            }
            if (
                targetAnswer.author.toString() !== existingUser._id.toString()
            ) {
                return res.json({ "message": "Access is denied." })
            }

            question.answers = question.answers.filter(
                (a) => a._id.toString() !== ansId
            )

            await question.save()
            return res.json({ "message": `answer with Id: ${ansId} is deleted` })
        }
    } catch (error) {
        console.log(error);
    }

}

// Edit_Answer .
export async function Edit_Answer(req, res, next) {
    const { quesId, ansId, body } = req.body
    const user = req.user

    // validation

    try {
        if (user) {
            const existingUser = await FindUser(user._id)
            const question = await Posts.findById(quesId)

            if (!question) {
                return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` })
            }

            const targetAnswer = question.answers.find(
                (a) => a._id.toString() === ansId
            )
            if (!targetAnswer) {
                return res.json({ "message": `Answer with Id ${ansId} does not exist in DB` })
            }
            if (
                targetAnswer.author.toString() !== existingUser._id.toString()
            ) {
                return res.json({ "message": "Access is denied." })
            }

            targetAnswer.body = body
            targetAnswer.updatedAt = Date.now()

            question.answers = question.answers.map((a) =>
                a._id.toString() !== ansId ? a : targetAnswer)

            const savedQues = await question.save()
            const populatedQues = await Posts.findById(quesId)
                .populate('author', 'name')
                .populate('answers.author', 'name')
                .populate('answers.comments.author', 'name');

            return res.json(populatedQues)


        }


    } catch (error) {
        console.log(error);
    }


}

// Vote_Answer .
export async function Vote_Answer(req, res, next) {
    const { quesId, ansId, voteType } = req.body
    const user = req.user

    try {
        if (user) {
            const existingUser = await FindUser(user._id)
            const question = await Posts.findById(quesId)

            if (!question) {
                return res.json({ "message": `Question with ID: ${quesId} does not exist in DB` })
            }

            const targetAnswer = question.answers.find(
                (a) => a._id.toString() === ansId
            )
            if (!targetAnswer) {
                return res.json({ "message": `Answer with Id ${ansId} does not exist in DB` })
            }
            if (
                targetAnswer.author.toString() === existingUser._id.toString()
            ) {
                return res.json({ "message": "You can't vote for your own post" })
            }

            let votedAns
            if (voteType === 'upvote') {
                votedAns = upvoteIt(targetAnswer, existingUser)
            } else {
                votedAns = downvoteIt(targetAnswer, existingUser)
            }

            question.answers = question.answers.map((a) =>
                a._id.toString() !== ansId ? a : votedAns)

            const savedQues = await question.save()

            const populatedQues = await Posts.findById(quesId)
                .populate('author', 'name')
                .populate('answers.author', 'name')
                .populate('answers.comments.author', 'name');

            const author = await FindUser(targetAnswer.author._id);
            const addeRepAuthor = ansRep(targetAnswer, author);
            await addeRepAuthor.save();

            const result = populatedQues.answers.find((a) => a._id.toString() === ansId);
            return res.json(result);


        }

    } catch (error) {
        console.log(error);
    }
}

// accept_Answer