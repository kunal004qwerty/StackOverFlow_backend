import mongoose from "mongoose";
import{Comments} from './comment.model.js'

const Schema = mongoose.Schema

const AnswerModel = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    body: {
        type: String,
        required: true,
        trim: true,
        minlength: 30,
    },
    comments: [Comments.schema],
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
    ]

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

const Answers = mongoose.model('answers', AnswerModel)
export { Answers }