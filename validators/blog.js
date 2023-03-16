import mongoose from "mongoose";
import { Blog } from '../models/index.js'
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

//========================================CreateBlog==========================================================//

const createBlog = async function (req, res, next) {
    try {
        const data = req.body

        const { title, content, userId } = req.body

        if (!isValidRequestBody(data)) {
            return res.status(422).send({ status: 1002, message: "Please Provide Details" })
        }

        if (!isValid(title)) {
            return res.status(422).send({ status: 1002, message: "title is required" })
        }

        if (!isValid(content)) {
            return res.status(422).send({ status: 1002, message: "content is required" })
        }

        next()

    } catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================UpdateBlog==========================================================//

const updateBlog = async function (req, res, next) {
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
            return res.status(422).send({ status: 1011, message: "This Blog is does not exists or already deleted" })
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

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================GetAllBlogs==========================================================//

const getAllBlogs = async function (req, res, next) {
    try {

        next()
    }
    catch (err) {

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================Deleteblog==========================================================//

const deleteBlog = async function (req, res, next) {
    try {

        let blogId = req.params.blogId

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }

        next()
    }
    catch (err) {

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================Createlike==========================================================//

const createLike = async function (req, res, next) {
    try {
        const blogId = req.params.blogId

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }

        let token = req.header('Authorization');
        let splitToken = token.split(" ")
        let decodedtoken = jwt.verify(splitToken[1], "SECRET_KEY")
        let userIdFromToken = decodedtoken.aud

        const existingLike = await Blog.findOne({ userId: userIdFromToken, _id: blogId, likes: { $gte: 1 } });
        if (existingLike) {
            return res.status(400).json({ status: 1003, message: 'You have already liked this blog' });
        }

        next()

    } catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}


export { createBlog, updateBlog, getAllBlogs, deleteBlog, createLike }

