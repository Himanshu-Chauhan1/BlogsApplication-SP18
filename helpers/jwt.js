import { } from 'dotenv/config'
import JWT from 'jsonwebtoken'

const signAccessToken = (userId, userRole) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userRole: userRole
        }
        const secret = process.env.JWT_SECRET_KEY || "SECRET_KEY"
        const option = {
            expiresIn: process.env.JWT_EXP_TIME || "3h",
            issuer: process.env.JWT_ISSUER_NAME || "sparkeighteen",
            audience: userId,
        };

        JWT.sign(payload, secret, option, (err, token) => {
            if (err) return reject(err);
            resolve(token)
        })
    })
}

export default signAccessToken;