import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../config/index.js'

const { JWT_APP_SECRET,JWT_EXPIRES_IN } = config.DB


// Generate_Salt
export async function GenerateSalt(){
    return await bcrypt.genSalt()
}


// Generate_Password
export async function GeneratePassword(password, salt){

    const hashPassword = bcrypt.hash(password,salt)

    console.log(password, 'UserPassword_BeforeHash');
    console.log(hashPassword, "UserPassword_AfterHash");

    return hashPassword


}


// Validate_Password
export async function ValidatePassword(enteredPassword, savedPassword, salt){
    const BolleanValue = await GeneratePassword(enteredPassword,salt) === savedPassword
    return BolleanValue
}


// Generate_Signature
export async function GenerateSignature(payload){

    const signature = jwt.sign(payload, JWT_APP_SECRET,{
        expiresIn:new Date().setDate(new Date().getDate() + JWT_EXPIRES_IN)
    })

    console.log(signature,"signature");

    return signature

}



// Validate_Signature
export async function ValidateSignature(req) {

    const signature = req.get('Authorization')
    if (signature) {

        const payload = await jwt.verify(signature.split(' ')[1], JWT_APP_SECRET)
        req.user = payload
        return true
    }

    return false

}