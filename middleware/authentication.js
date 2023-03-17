import jwt from 'jsonwebtoken';

//----------------------------------------authentication----------------------------------------------------*/
const authentication = async function (req, res, next) {
    try {

        let token = req.header('Authorization', 'Bearer');
        if (!token) return res.status(422).send({ status: 1002, message: "Login is Required!" })

        let splitToken = token.split(" ")

        let verifiedtoken = jwt.verify(splitToken[1], process.env.JWT_SECRET_KEY)
        if (!verifiedtoken) return res.status(422).send({ status: 1003, message: "Invalid Token!" })

        let exp = verifiedtoken.exp
        let iatNow = Math.floor(Date.now() / 1000)
        if (exp <= iatNow) {
            return res.status(401).send({ status: 1003, message: 'Session expired, Please login again!' })
        }
        req.userId = verifiedtoken.aud
        req.verifiedtoken = verifiedtoken

        next()
    }
    catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check again" })
    }
}

export { authentication }




