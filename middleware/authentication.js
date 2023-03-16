import jwt from 'jsonwebtoken';

//----------------------------------------authentication----------------------------------------------------*/
const authentication = async function (req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) return res.status(400).send({ status: 1003, message: "Token is Required" })

        let splitToken = token.split(" ")
        jwt.verify(splitToken[1], "SECRET_KEY", (error, data) => {
            if (error) {
                return res.status(401).send({ status: 1007, message: "Token is Invalid" })
            } else {
                req.userId = data.aud
                next();
            }
        })
    }
    catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check again" })
    }
}

export { authentication }




