import { User } from '../models/index.js'
import signAccessToken from "../helpers/jwt.js"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
const nodeKey = process.env.NODE_KEY


//========================================POST /register==========================================================//

const create = async function (req, res) {
    try {

        const userCreated = await User.create(req.body)

        res.status(201).send({ status: 1009, message: "User has been created successfully", data: userCreated })

    } catch (err) {
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================POST /login==========================================================

let login = async (req, res) => {
    try {

        let data = req.body

        let { email, password } = data

        const user1 = await User.findOne({ email: email });
        if (!user1) {
            return res.status(422).send({ status: 1003, message: "Invalid email credentials" });
        }
        let checkPassword = await bcrypt.compare(password + nodeKey, user1.password)
        if (!checkPassword) return res.status(422).send({ status: 1003, msg: " Invalid password credentials" })

        const token = await signAccessToken(user1._id.toString(), user1.userRole, user1.email);

        const userData = {
            token: token,
            role: user1.userRole,
            email: user1.email
        }
        return res.status(200).send({ status: 1010, message: "User has been successfully logged in", data: userData })

    } catch (error) {
        console.log(error.message);
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================POST /logout========================================================//

const logout = async (req, res) => {
    try {

        let token = req.header('Authorization', 'Bearer');

        if (!token) return res.status(401).send({ status: 1009, message: 'Token is required' });

        let splitToken = token.split(" ")

        let verifiedtoken = jwt.verify(splitToken[1], "SECRET_KEY")
        verifiedtoken.exp = 0

        return res.status(200).send({ status: 1010, message: "You have been successfully logged out" })

    } catch (error) {
        console.log(error.message);
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================POST/updateUser==========================================================//

const update = async function (req, res) {
    try {

        let userId = req.params.id
        let data = req.body
        let { name, email, phone, password } = data

        const updateUser = await User.findOneAndUpdate({ _id: userId, isDeleted: false }, {
            $set: {
                name: name,
                phone: phone,
                email: email,
                password: password
            }
        }, { new: true });

        return res.status(200).send({ status: 1010, message: 'User has been updated Successfully', data: updateUser })

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/deleteBooks==========================================================//

const destroy = async function (req, res) {
    try {

        let userId = req.params.id

        let checkUser = await User.findOne({ $and: [{ _id: userId }, { isDeleted: false }] })

        if (!checkUser) {
            return res.status(422).send({ status: 1011, message: "User Already Deleted" })
        }

        let updateUser = await User.findOneAndUpdate({ _id: userId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        return res.status(200).send({ status: 1010, message: 'User has been deleted Successfully', data: updateUser })
    }
    catch (err) {

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};


export { create, login, logout, update, destroy }
