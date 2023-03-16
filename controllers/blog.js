import { Blog } from '../models/index.js'
import jwt from 'jsonwebtoken';


//========================================POST /register==========================================================//

const create = async function (req, res) {
    try {
        let data = req.body
        let { title, content } = data

        let token = req.header('Authorization');
        let splitToken = token.split(" ")
        let decodedtoken = jwt.verify(splitToken[1], "SECRET_KEY")

        let userIdFromToken = decodedtoken.aud

        const blogCreated = await Blog.create({
            title: title,
            content: content,
            userId: userIdFromToken
        })

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

        const updateBlog = await Blog.findOneAndUpdate({ _id: blogId, isDeleted: false }, {
            $set: {
                title: title,
                content: content,
            }
        }, { new: true });

        if (!updateBlog) {
            return res.status(404).send({ status: 1006, message: "No Data Match" });
        }

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

        let blogData = await Blog.find({ $and: [{ isDeleted: false }] })

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

//========================================POST//Createlike==========================================================//

const like = async function (req, res) {
    try {
        const blogId = req.params.blogId

        const findblog = await Blog.findById(blogId);
        findblog.likes += 1;

        const saveLike = await findblog.save()

        const updateLike = await Blog.findByIdAndUpdate({ _id: blogId, isDeleted: false },
            {
                $set: {
                    like: saveLike,
                }
            },
            { new: true })

        return res.status(200).send({ status: 1010, message: 'You have liked the blog Successfully', data: updateLike })

    } catch (error) {
        console.log(error.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}


export { create, update, index, destroy, like }
