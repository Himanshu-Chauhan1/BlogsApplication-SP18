import { } from 'dotenv/config'
import JWT from 'jsonwebtoken'

const signAccessToken = (userId, userRole, userEmail) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userRole: userRole,
            userEmail: userEmail
        }
        const secret = process.env.JWT_SECRET_KEY
        const option = {
            expiresIn: process.env.JWT_EXP_TIME,
            issuer: process.env.JWT_ISSUER_NAME,
            audience: userId,
        };

        JWT.sign(payload, secret, option, (err, token) => {
            if (err) return reject(err);
            resolve(token)
        })
    })
}

export default signAccessToken;