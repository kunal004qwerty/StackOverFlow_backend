import { ValidateSignature } from '../utility/index.js'


export async function Authenticate(req, res, next) {
    const validate = await ValidateSignature(req)

    if (validate) {
        next()
    } else {
        return res.json({ "message": "user not Authorized" })
    }
}