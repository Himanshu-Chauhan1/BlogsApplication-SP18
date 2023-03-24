import { User, Blog, Comment } from '../models/index.js'
import signAccessToken from "../helpers/jwt.js"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
const nodeKey = process.env.NODE_KEY


//========================================POST /register==========================================================//

const create = async function (req, res) {
    try {

        const adminCreated = await User.create(req.body)

        res.status(201).send({ status: 1009, message: "User has been created successfully", data: adminCreated })

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

        let userId = req.params.userId
        let data = req.body
        let { name, email, phone, password } = data

        const updateUser = await User.findOneAndUpdate({ _id: userId, isDeleted: false }, { $set: { name: name, phone: phone, email: email, password: password } }, { new: true });

        return res.status(200).send({ status: 1010, message: 'User has been updated Successfully', data: updateUser })

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/getUsers==========================================================//

const index = async function (req, res) {
    try {

        let userData = await User.find({ $and: [{ isDeleted: false }] }).select({ name: 1, phone: 1, email: 1, password: 1 })

        if (!userData) {
            return res.status(422).send({ status: 1006, message: "No Users Found....." });
        }

        return res.status(200).send({ status: 1010, message: 'All Users', data: userData })
    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/deleteadmin/users==========================================================//

const destroy = async function (req, res) {
    try {

        let userId = req.params.userid


        let checkUser = await User.findOne({ $and: [{ _id: userId }, { isDeleted: false }] })

        if (!checkUser) {
            return res.status(422).send({ status: 1011, message: "User is Already Deleted" })
        }

        let updateUser = await User.findOneAndUpdate({ _id: userId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        return res.status(200).send({ status: 1010, message: 'User has been deleted Successfully', data: updateUser })
    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/updateblog==========================================================//

const updateABlog = async function (req, res) {
    try {

        let blogId = req.params.blogId
        let data = req.body
        let { title, content } = data

        const updateBlog = await Blog.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { title: title, content: content } }, { new: true });

        return res.status(200).send({ status: 1010, message: 'Your Blog has been updated Successfully', data: updateBlog })

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/deleteblog==========================================================//

const deleteABlog = async function (req, res) {
    try {

        let blogId = req.params.blogId

        let checkBlog = await Blog.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })

        if (!checkBlog) {
            return res.status(422).send({ status: 1011, message: "This Blog is Already Deleted" })
        }

        let updateBlog = await Blog.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        return res.status(200).send({ status: 1010, message: 'Your Blog has been deleted Successfully', data: updateBlog })
    }
    catch (err) {
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//==================================================GET/GET-ALL-MENU==========================================================//

const getCommentsByFilter = async function (req, res) {
    try {

        let data = req.query
        let { blogId, name, email } = data

        if (Object.keys(req.query).length > 0) {
            let findCommentsByFilter = await Comment.find(
                { isDeleted: false },
                { name: name },
                { email: email },
                { blog: blogId },
            )

            if (!findCommentsByFilter.length)
                return res.status(404).send({ status: 1006, message: "No Comments found as per the filters applied" })

            return res.status(200).send({ status: 1010, data: findCommentsByFilter })
        } else {

            let findAllComment = await Comment.find({ isDeleted: false }).select({ name: 1, email: 1, content: 1, blog: 1 })

            if (findAllComment.length === 0) {
                return res.status(401).send({ Status: 1010, message: "No comments found...." });
            }

            return res.status(200).send({ status: 1010, message: 'All comments:', comments: findAllComment.length, data: findAllComment })
        }
    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, message: "Something went wrong Please check back again" })
    }
};


export { create, login, logout, update, index, destroy, updateABlog, deleteABlog, getCommentsByFilter }
