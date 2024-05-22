import express from 'express';
import { Posts, User } from '../models/index.js'
import { GeneratePassword, GenerateSalt, } from '../utility/password.utils.js';
import { GRAVATAR_URL } from '../utility/constants.js';
import { getRandomInt } from '../utility/math.utils.js';

export async function FindUser(id, email) {
    if (email) {
        return await User.findOne({ email: email })
    } else {
        return await User.findById({ _id: id })
    }

}

// Create User or Register_User
export async function Register(req, res, next) {

    const { name, email, password, profilePicture } = req.body

    const existingUser = await FindUser('', email)

    if (existingUser !== null) {
        return res.json({ 'messsage': 'A User is Exist with that EmailId' })
    }

    // generate Salt
    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt)

    // encrtpting the password using salt

    // generating randomPic for the user
    let gravatar = GRAVATAR_URL(getRandomInt())
    console.log(gravatar, "gravatar");

    const createUser = await User.create({
        name: name,
        email: email,
        password: userPassword,
        salt: salt,
        profilePicture: profilePicture ? profilePicture : gravatar,
    })

    return res.json(createUser)

}

// Get_all_Users
export async function GetAllUser(req, res, next) {
    const users = await User.find()

    if (users != null) {
        return res.json(users)
    }

    return res.json({ "message": "user data not avilable " })
}

// Get_User_by_Id
export async function GetuserById(req, res, next) {
    const userId = req.params.id;

    const user = await FindUser(userId)

    const recentQuestion = await Posts.find({ author: userId })
        .sort({ createdAt: -1 })
        .select('_id title points createdAt')
        .limit(5)

    const recentAnswers = await Posts.find({
        answers: { $elemMatch: { author: userId } },
    })
        .sort({ createdAt: -1 })
        .select('id title points createdAt')
        .limit(5);

    if (user !== null) {
        const userWithRecentData = {
            user: user,
            recentQuestion: recentQuestion,
            recentAnswers: recentAnswers
        };
        return res.json(userWithRecentData);
    }
    return res.json({ "message": "user not found" })
}