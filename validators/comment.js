import mongoose from "mongoose";
import { Comment, Blog, User } from '../models/index.js'
import jwt from 'jsonwebtoken'

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

//========================================CreateBlog==========================================================//

const createComment = async function (req, res, next) {
    try {

        const data = req.body
        let blogId = req.params.blogId

        const { name, email, content } = req.body

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id to create a comment...." })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }

        if (!isValidRequestBody(data)) {
            return res.status(422).send({ status: 1002, message: "Please Provide Details" })
        }

        if (!isValid(content)) {
            return res.status(422).send({ status: 1002, message: "content is required" })
        }

        let checkBlog = await Blog.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })

        if (!checkBlog) {
            return res.status(422).send({ status: 1011, message: "This Blog is does not exists or already deleted" })
        }

        next()

    } catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================UpdateBlog==========================================================//

const updateComment = async function (req, res, next) {
    try {

        let blogId = req.params.blogId
        let commentId = req.params.commentId

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }

        if (!commentId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(commentId)) {
            return res.status(422).send({ status: 1003, message: "Invalid comment-Id" })
        }

        let checkBlog = await Blog.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })

        if (!checkBlog) {
            return res.status(422).send({ status: 1011, message: "This Blog is does not exists or already deleted" })
        }

        let checkBlogComment = await Comment.findOne({ $and: [{ _id: commentId }, { blog: blogId }, { isDeleted: false }] })

        if (!checkBlogComment) {
            return res.status(422).send({ status: 1011, message: "This comment for this blog does not exists or already deleted" })
        }

        const verifiedtoken = req.verifiedtoken
        let emailFromToken = verifiedtoken.userEmail

        let checkCommentUser = await Comment.findOne({ $and: [{ _id: commentId }, { email: emailFromToken }, { isDeleted: false }] })

        if (!checkCommentUser) {
            return res.status(401).send({ Status: 1010, message: "Unauthorized Access! You dont have correct privilege to perform this operation" });
        }

        const data = req.body

        const { content } = data

        const dataObject = {};

        if (!Object.keys(data).length && typeof files === 'undefined') {
            return res.status(422).send({ status: 1002, msg: " Please provide some data to update" })
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

//========================================GetCommentsOnABlog==========================================================//

const getAllCommentsByBlogId = async function (req, res, next) {
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

//========================================Deletecomment==========================================================//

const deleteComment = async function (req, res, next) {
    try {

        let blogId = req.params.blogId
        let commentId = req.params.commentId

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

        if (!commentId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(commentId)) {
            return res.status(422).send({ status: 1003, message: "Invalid comment-Id" })
        }

        let checkBlogComment = await Comment.findOne({ $and: [{ _id: commentId }, { blogId: blogId }, { isDeleted: false }] })

        if (!checkBlogComment) {
            return res.status(422).send({ status: 1011, message: "Comment for this blog is Already Deleted" })
        }

        const verifiedtoken = req.verifiedtoken
        let emailFromToken = verifiedtoken.userEmail

        let checkCommentUser = await Comment.findOne({ $and: [{ _id: commentId }, { email: emailFromToken }, { isDeleted: false }] })

        if (!checkCommentUser) {
            return res.status(401).send({ Status: 1010, message: "Unauthorized Access! You dont have correct privilege to perform this operation" });
        }

        next()
    }
    catch (err) {

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};


export { createComment, updateComment, getAllCommentsByBlogId, deleteComment }

