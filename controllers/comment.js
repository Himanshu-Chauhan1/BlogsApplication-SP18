import { Comment, User, Blog } from '../models/index.js'
import jwt from 'jsonwebtoken';


//========================================POST /Comment==========================================================//

const create = async function (req, res) {
    try {
        let blogId = req.params.blogId
        const verifiedtoken = req.verifiedtoken
        let idFromToken = verifiedtoken.aud

        const findUser = await User.findById(idFromToken);

        const commentCreated = await Comment.create({
            name: findUser.name,
            email: findUser.email,
            content: req.body.content,
        })

        const updateBlogs = await Blog.findOneAndUpdate({ _id: blogId }, { $push: { comments: commentCreated._id } });

        res.status(201).send({ status: 1009, message: "Your Comment has been registered successfully", data: commentCreated })

    } catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================POST/updateComment==========================================================//

const update = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let commentId = req.params.commentId

        let data = req.body
        let { content } = data

        const updateBlogComment = await Comment.findOneAndUpdate({ _id: commentId, isDeleted: false }, { $set: { content: content } }, { new: true });

        return res.status(200).send({ status: 1010, message: 'Your comment for the selected Blog has been updated Successfully', data: updateBlogComment })
    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================GetComments==========================================================//

const get = async function (req, res) {
    try {

        let blogId = req.params.blogId

        let findAllComment = await Comment.find({ blog: blogId }, { isDeleted: false }).select({ name: 1, email: 1, content: 1, blog: 1 })

        if (findAllComment.length === 0) {
            return res.status(401).send({ Status: 1010, message: "No comments found on this blog...." });
        }

        return res.status(200).send({ status: 1010, message: 'All comments on the blog:', comments: findAllComment.length, data: findAllComment })
    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/deleteComment==========================================================//

const destroy = async function (req, res) {
    try {

        let blogId = req.params.blogId
        let commentId = req.params.commentId

        let updateBlogComment = await Comment.findOneAndUpdate({ _id: commentId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        return res.status(200).send({ status: 1010, message: 'Your comment for the selected Blog has been deleted Successfully', data: updateBlogComment })

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};


export { create, update, get, destroy }