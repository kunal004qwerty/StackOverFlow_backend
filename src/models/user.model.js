import mongoose from 'mongoose'

const Schema = mongoose.Schema

// const UserSchema = new Schema({}) 
const UserModel = new Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    salt: {
        type: String
    },
    password: {
        type: String, required: true
    },
    profilePicture: {
        type: String, required: true
    },
    views: {
        type: Number, default: 0
    },
    city: {
        type: String
    },
    work: {
        type: String
    },
    desc: {
        type: String
    },
    posts: [{
        postsId:{type:Schema.Types.ObjectId, ref:'posts'},
        rep:{type:Number,default:0}
    }],
    answers: [{
        answersId:{type:Schema.Types.ObjectId, ref:'answers'},
        rep:{type:Number,default:0}
    }]



}, {
    toJSON: {
        transform(doc, ret) {
            // delete ret.password;
            delete ret.__v;
            // delete ret.createdAt
            // delete ret.updatedAt
        }
    },
    timestamps: true
})

const User = mongoose.model('user', UserModel)
export { User }