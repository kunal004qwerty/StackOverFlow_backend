import mongoose from "mongoose";

const Schema = mongoose.Schema

// const TagSchema = new Schema({}) 
const TagModel = new Schema({
    tagname: {
        type: String,
        required: true,
        trim: true

    },
    description: {
        type: String
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "posts" }],
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt
            delete ret.updatedAt
        }
    },
    timestamps: true
})

const Tags = mongoose.model('tags', TagModel)
export { Tags }


// tags_modal  amnot using i am directy passing the array of string