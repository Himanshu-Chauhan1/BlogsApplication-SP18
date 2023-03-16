import jwt from 'jsonwebtoken';
import User from '../models/user.js';

//----------------------------------------authorization----------------------------------------------------*//

let authorization = async function (req, res, next) {
    try {

        const verifiedtoken = req.verifiedtoken

        const user = await User.findById(verifiedtoken._id)
        const userRole = user.role

        let tokenRole = verifiedtoken.role

        if (tokenRole !== userRole) {
            return res.status(401).send({ Status: 1010, message: "Access Denied! You dont have correct privilege to perform this operation" });
        } else {
            next()
        }
    }
    catch (error) {
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check again" })
    }
}

export { authorization }

