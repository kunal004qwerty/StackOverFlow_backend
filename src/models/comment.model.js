import mongoose from "mongoose";

const Schema = mongoose.Schema

// const CommentSchema = new Schema({}) 
const CommentModel = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
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

const Comments = mongoose.model('comments', CommentModel)
export { Comments }