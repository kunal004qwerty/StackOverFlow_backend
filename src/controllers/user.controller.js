import { FindUser } from "../controllers/index.js"
import { GenerateSignature, ValidatePassword } from "../utility/index.js"


export async function UserLogin(req, res, next) {
    const { email, password } = req.body

    const existingUser = await FindUser('', email)

    if (existingUser !== null) {
        // validation and give access

        const validation = await ValidatePassword(password, existingUser.password, existingUser.salt)

        if (validation) {
            const signature =await GenerateSignature({
                _id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name
            })

            return res.json(signature)
        } else {
            return res.json({ "message": "Password is Not Valid" })
        }


    }
    return res.json({ "message": "Login Credential not Valid" })


}


//  here we returning signature that we going to use adin and again
//  if User is Login  than move forward (for that we install JOSONWEBTOKEN)

export async function GetUserProfile(req, res, next) {
    const user = req.user

    if (user) {
        const existingUser = await FindUser(user._id)
        return res.json(existingUser)
    }
    return res.json({ "message": "User Information Not Founded" })

}

export async function UpdateUserProfile(req, res, next) {

    const { name, city, work, desc } = req.body

    const user = req.user;

    if(user){
        const existingUser = await FindUser(user._id)

        if(existingUser !== null){
            existingUser.name = name,
            existingUser.city = city,
            existingUser.work = work,
            existingUser.desc = desc

            const saveResult = await existingUser.save()
            return res.json(saveResult)
        }

        return res.json(existingUser)
    }
    return res.json({"message":"User Information Not Found"})


}