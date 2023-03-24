import { Blog, User, Comment, Like } from '../models/index.js'

//========================================POST /register==========================================================//

const create = async function (req, res) {
    try {
        let data = req.body
        let { title, content } = data

        const verifiedtoken = req.verifiedtoken
        let idFromToken = verifiedtoken.aud

        const blogCreated = await Blog.create({ title: title, content: content, user: idFromToken })

        res.status(201).send({ status: 1009, message: "Your Blog has been created successfully", data: blogCreated })

    } catch (err) {
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================POST/updateblog==========================================================//

const update = async function (req, res) {
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

//========================================POST/getAllBlogs==========================================================//

const index = async function (req, res) {
    try {

        let blogData = await Blog.find({ $and: [{ isDeleted: false }] }).select({ title: 1, content: 1 })


        if (!blogData) {
            return res.status(422).send({ status: 1006, message: "No Blogs Found....." });
        }

        return res.status(200).send({ status: 1010, message: 'All Blogs:', data: blogData })
    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/getAllBlogs==========================================================//

const get = async function (req, res) {
    try {

        let blogId = req.params.blogId

        // const blogData = await Blog.aggregate([
        //     {
        //         $lookup: {
        //             from: "comments",
        //             localField: "comments",
        //             foreignField: "Comment",
        //             as: "comments",
        //         },
        //     },
        //     {
        //         $lookup: {
        //             from: "likes",
        //             localField: "likes",
        //             foreignField: "Like",
        //             as: "likes"
        //         }
        //     }
        // ])

        const blogData = await Blog.find({ _id: blogId })
            .populate("comments likes", { name: 1, email: 1, content: 1, like: 1, userId: 1, blogId: 1 })
            .select({ createdAt: 0, updatedAt: 0, isDeleted: 0, role: 0, __v: 0 })

        if (blogData.length === 0) {
            return res.status(422).send({ status: 1006, message: "No Blogs Found....." });
        }
        return res.status(200).send({ status: 1010, message: 'The entered blog details:', data: blogData })

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/deleteblog==========================================================//

const destroy = async function (req, res) {
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



export { create, update, index, get, destroy }
