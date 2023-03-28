import User from '../models/user.js';

//----------------------------------------authorization----------------------------------------------------*//

let authorization = async function (req, res, next) {
    try {

        const verifiedtoken = req.verifiedtoken
        let idFromToken = verifiedtoken.aud
        const roleFromToken = verifiedtoken.userRole

        const user = await User.findById(idFromToken)
        const userRole = user.userRole

        if (roleFromToken !== userRole) {
            return res.status(401).send({ Status: 1010, message: "Unauthorized Access! You dont have correct privilege to perform this operation" });
        } else {
            next()
        }

    }
    catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check again" })
    }
}

export { authorization }

