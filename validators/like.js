import { Like, User, Blog } from "../models/index.js"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';


////////////////////////// -GLOBAL- //////////////////////
const isValid = function (value) {
    if (!value || typeof value != "string" || value.trim().length == 0)
        return false;
    return true;
};

//////////////// -FOR EMPTY BODY- ///////////////////////
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

//////////////// -FOR OBJECTID VALIDATION- ///////////////////////
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

////////////////////////// -GLOBAL- //////////////////////
const isValidNumber = function (value) {
    if (!value || typeof value != "number")
        return false;
    return true;
};


//========================================Createlike==========================================================//

const createLike = async function (req, res, next) {
    try {

        const blogId = req.params.blogId
        let data = req.body
        let { like } = data

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }

        let checkBlog = await Blog.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })

        if (!checkBlog) {
            return res.status(422).send({ status: 1011, message: "This Blog does not exists or already deleted" })
        }

        if (!isValid(like)) {
            return res.status(422).send({ status: 1002, message: "like is required" })
        }


        next()

    } catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================Updatelike==========================================================//

const updateLike = async function (req, res, next) {
    try {

        let blogId = req.params.blogId

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }


        let checkAdmin = await User.findOne({ $and: [{ _id: userId }, { isDeleted: false }, { userRole: "user" }] })

        if (!checkAdmin) {
            if (idFromToken !== userId) {
                return res.status(401).send({ Status: 1010, message: "Unauthorized Access! You dont have correct privilege to perform this operation" });
            }
        }

        const verifiedtoken = req.verifiedtoken
        let idFromToken = verifiedtoken.aud

        let checkBlogUser = await Blog.findOne({ $and: [{ _id: blogId }, { userId: idFromToken }, { isDeleted: false }] })

        if (!checkBlogUser) {
            return res.status(401).send({ Status: 1010, message: "Unauthorized Access! You dont have correct privilege to perform this operation" });
        }

        let checkBlog = await Blog.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })

        if (!checkBlog) {
            return res.status(422).send({ status: 1011, message: "This Blog does not exists or already deleted" })
        }

        const data = req.body

        const { title, content } = data

        const dataObject = {};

        if (!Object.keys(data).length && typeof files === 'undefined') {
            return res.status(422).send({ status: 1002, msg: " Please provide some data to update" })
        }

        if ("title" in data) {

            if (!isValid(title)) {
                return res.status(422).send({ status: 1002, message: "title is required" })
            }

            dataObject['title'] = title
        }

        if ("content" in data) {

            if (!isValid(content)) {
                return res.status(422).send({ status: 1002, message: "content is required" })
            }

            dataObject['content'] = content
        }

        next()
    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};


//========================================POST/getlikes==========================================================//

const getAllLikes = async function (req, res, next) {
    try {

        let blogId = req.params.blogId

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }

        let checkBlog = await Blog.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })

        if (!checkBlog) {
            return res.status(422).send({ status: 1011, message: "This Blog does not exists or already deleted" })
        }

        next()

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

export { createLike, updateLike, getAllLikes }
