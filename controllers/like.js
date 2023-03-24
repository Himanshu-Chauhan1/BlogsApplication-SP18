import { Blog, Like } from '../models/index.js'

//========================================POST/createLike==========================================================//

const create = async function (req, res) {
    try {

        const blogId = req.params.blogId
        let data = req.body
        let { like } = data

        const verifiedtoken = req.verifiedtoken
        let idFromToken = verifiedtoken.aud

        const alreadyLiked = await Like.findOne({ blogId: blogId, userId: idFromToken, like: true })

        if (alreadyLiked) {
            return res.status(422).send({ status: 1010, message: 'You have already liked the blog ' })
        }

        const likeCreated = await Like.create({ blogId: blogId, userId: idFromToken, like: like })

        const updateBlogs = await Blog.findOneAndUpdate({ _id: blogId }, { $push: { likes: likeCreated } });

        return res.status(200).send({ status: 1010, message: 'You have liked the blog Successfully', data: likeCreated })

    } catch (err) {
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================POST/updatelike==========================================================//

const update = async function (req, res) {
    try {

        let blogId = req.params.blogId
        let data = req.body
        let { like } = data

        const updateLike = await Like.findOneAndUpdate({ blogId: blogId, isDeleted: false }, { $set: { like: like } }, { new: true });

        return res.status(200).send({ status: 1010, message: 'Your Blog has been updated Successfully', data: updateLike })

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================POST/getlikes==========================================================//

const index = async function (req, res) {
    try {

        let blogId = req.params.blogId

        const likeData = await Like.find({ blogId: blogId }, { isDeleted: false }).select({ blogId: 1, userId: 1, like: 1 })

        if (likeData.length === 0) {
            return res.status(422).send({ status: 1006, message: "No likes Found for this blog....." });
        }
        return res.status(200).send({ status: 1010, message: 'All likes on this blog:', data: likeData })

    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};


export { create, update, index }
