import mongoose from "mongoose";
import { Answers } from './answer.model.js'
import { Comments } from './comment.model.js'
import { Tags } from "./tags.model.js";

const Schema = mongoose.Schema
const PostModel = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tags: [{ type: String, required: true, trim: true }],
    // tags:[Tags.schema],
    comments:[Comments.schema],
    answers: [Answers.schema],
    points: {
        type: Number,
        default: 0,
    },
    upvotedBy: [
        {
            type: Schema.Types.ObjectId, ref: 'user'
        }
    ],
    downvotedBy: [
        {
            type: Schema.Types.ObjectId, ref: 'user'
        }
    ],
    acceptedAnswer: { type: Schema.Types.ObjectId, ref: 'answers' },
    views: {
        type: Number,
        default: 0
    },
    hotAlgo: {
        type: Number, default: Date.now
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            // delete ret.createdAt
            // delete ret.updatedAt
        }
    },
    timestamps: true
})

const Posts = mongoose.model('posts', PostModel)
export { Posts }