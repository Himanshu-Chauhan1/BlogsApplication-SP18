import { Comment, User, Blog } from '../models/index.js'
import jwt from 'jsonwebtoken';


//========================================POST /Comment==========================================================//

const create = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let token = req.header('Authorization');
        let splitToken = token.split(" ")
        let decodedtoken = jwt.verify(splitToken[1], "SECRET_KEY")

        let userIdFromToken = decodedtoken.aud

        const findUser = await User.findById(userIdFromToken);

        const commentCreated = await Comment.create({
            name: findUser.name,
            email: findUser.email,
            content: req.body.content,
            blog: blogId
        })

        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {
                    comments: commentCreated

                }
            },
            { new: true }
        ).populate('comments');

        console.log(blog)

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

        const updateBlogComment = await Comment.findOneAndUpdate({ _id: commentId, isDeleted: false }, {
            $set: {
                content: content,
            }
        }, { new: true });

        console.log(updateBlogComment)

        if (!updateBlogComment) {
            return res.status(404).send({ status: 1006, message: "No Data Match" });
        }

        return res.status(200).send({ status: 1010, message: 'Your comment for the selected Blog has been updated Successfully', data: updateBlogComment })
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

        let checkBlog = await Blog.findOne({ $and: [{ blog: blogId }, { isDeleted: false }] })

        if (!checkBlog) {
            return res.status(422).send({ status: 1011, message: "This Blog is Deleted, comments are also deleted" })
        }

        let checkBlogComment = await Comment.findOne({ $and: [{ _id: commentId }, { isDeleted: false }] })

        if (!checkBlogComment) {
            return res.status(422).send({ status: 1011, message: "Comment for this blog is Already Deleted" })
        }

        let updateBlogComment = await Comment.findOneAndUpdate({ _id: commentId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        return res.status(200).send({ status: 1010, message: 'Your comment for the selected Blog has been deleted Successfully', data: updateBlogComment })

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};


export { create, update, destroy }