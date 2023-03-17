import mongoose from "mongoose";
import { User, Blog } from '../models/index.js'


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

//////////////// -FOR PHONE- ///////////////////////
const isValidPhone = (phone) => {
    return /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone);
};

//////////////// -FOR EMAIL- ///////////////////////
const isValidEmail = (email) => {
    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
};

//========================================CreateUser==========================================================//

const createAdmin = async function (req, res, next) {
    try {
        const data = req.body

        const { name, phone, email, password, userRole } = req.body

        if (!isValidRequestBody(data)) {
            return res.status(422).send({ status: 1002, message: "Please Provide Details" })
        }

        if (!isValid(name)) {
            return res.status(422).send({ status: 1002, message: "Name is required" })
        }

        if (!(phone)) {
            return res.status(422).send({ status: 1002, message: "Phone No. is required" })
        }

        if (!isValidPhone(phone)) {
            return res.status(422).send({ status: 1003, message: "plz enter a valid Phone no" })
        }

        const isRegisteredphone = await User.findOne({ phone: phone })

        if (isRegisteredphone) {
            return res.status(422).send({ status: 1008, message: "phoneNo. number already registered" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: 1002, message: "Email is required" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: 1003, message: "plz enter a valid Email" })
        }

        const isRegisteredEmail = await User.findOne({ email: email })

        if (isRegisteredEmail) {
            return res.status(422).send({ status: 1008, message: "email id already registered" })
        }

        if (!isValid(password)) {
            return res.status(422).send({ status: 1002, message: "Password is required" })
        }

        if (password.length < 8) {
            return res.status(422).send({ status: 1003, message: "Your password must be at least 8 characters" })
        }
        if (password.length > 15) {
            return res.status(422).send({ status: 1003, message: "Password cannot be more than 15 characters" })
        }

        data.userRole = "admin".toLowerCase()

        next()

    } catch (error) {
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================LoginUser==========================================================//

let adminLogin = async (req, res, next) => {
    try {
        const data = req.body;
        let { email, password } = data

        if (!isValidRequestBody(data)) {
            return res.status(422).send({ status: 1002, message: "Please Provide Details" })
        }
        if (!isValid(email)) {
            return res.status(422).send({ status: 1002, message: "Email is required" })
        }

        if (!isValidEmail(email)) {
            return res.status(422).send({ status: 1003, message: "Email should be a valid email address" })
        }

        if (!isValid(password)) {
            return res.status(422).send({ status: 1002, message: "password is required" })
        }

        next()

    } catch (error) {
        console.log(error.message);
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}


//========================================Updateuser==========================================================//

const updateAdmin = async function (req, res, next) {
    try {

        let userId = req.params.id

        if (!userId) {
            return res.status(422).send({ status: 1002, message: "Please enter User-Id" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(422).send({ status: 1003, message: "Invalid user-Id" })
        }

        const verifiedtoken = req.verifiedtoken
        let idFromToken = verifiedtoken.aud

        let checkAdmin = await User.findOne({ $and: [{ _id: userId }, { isDeleted: false }, { userRole: "user" }] })

        if (!checkAdmin) {
            if (idFromToken !== userId) {
                return res.status(401).send({ Status: 1010, message: "Unauthorized Access! You dont have correct privilege to perform this operation" });
            }
        }

        let checkUser = await User.findOne({ $and: [{ _id: userId }, { isDeleted: false }] })

        if (!checkUser) {
            return res.status(422).send({ status: 1011, message: "This user does not exists or already deleted" })
        }

        const data = req.body

        const { name, email, phone, password, userRole } = data

        const dataObject = {};

        if (!Object.keys(data).length && typeof files === 'undefined') {
            return res.status(422).send({ status: 1002, msg: " Please provide some data to update" })
        }

        if ("name" in data) {

            if (!isValid(name)) {
                return res.status(422).send({ status: 1002, message: "name is required" })
            }

            dataObject['name'] = name
        }

        if ("phone" in data) {

            if (!isValid(phone)) {
                return res.status(422).send({ status: 1002, message: "phone is required" })
            }

            if (!isValidPhone(phone)) {
                return res.status(422).send({ status: 1003, message: "plz enter a valid Phone no" })
            }

            const isRegisteredphone = await User.findOne({ phone: phone })

            if (isRegisteredphone) {
                return res.status(422).send({ status: 1008, message: "This phoneNo. is already registered, please enter a new one to update" })
            }

            dataObject['phone'] = phone
        }

        if ("email" in data) {

            if (!isValid(email)) {
                return res.status(422).send({ status: 1002, message: "email is required" })
            }

            if (!isValidEmail(email)) {
                return res.status(400).send({ status: 1003, message: "please enter a valid Email" })
            }

            const isRegisteredEmail = await User.findOne({ email: email })

            if (isRegisteredEmail) {
                return res.status(422).send({ status: 1008, message: "This email id is already registered, please enter a new one to" })
            }


            dataObject['email'] = email
        }

        if ("password" in data) {

            if (!isValid(phone)) {
                return res.status(422).send({ status: 1002, message: "phone is required" })
            }

            if (password.length < 8) {
                return res.status(422).send({ status: 1003, message: "Your password must be at least 8 characters" })
            }
            if (password.length > 15) {
                return res.status(422).send({ status: 1003, message: "Password cannot be more than 15 characters" })
            }

            dataObject['password'] = password
        }

        if ("userRole" in data) {

            if (isValid(userRole)) {
                return res.status(422).send({ status: 1002, message: "You cannot update a userRole" })
            }

            dataObject['userRole'] = userRole
        }

        next()
    }
    catch (err) {
        console.log(err.message)
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================DeleteUser==========================================================//

const getAllUser = async function (req, res, next) {
    try {

        const verifiedtoken = req.verifiedtoken
        const roleFromToken = verifiedtoken.userRole

        if (!(roleFromToken == 'admin')) {
            return res.status(422).send({ status: 1003, message: "Only admin can get all the users....." })
        }

        next()
    }
    catch (err) {

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================DeleteUser==========================================================//

const deleteAdmin = async function (req, res, next) {
    try {

        let userId = req.params.id

        if (!userId) {
            return res.status(422).send({ status: 1002, message: "Please enter user-Id" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(422).send({ status: 1003, message: "Invalid user-Id" })
        }

        const verifiedtoken = req.verifiedtoken
        let idFromToken = verifiedtoken.aud

        let checkAdmin = await User.findOne({ $and: [{ _id: userId }, { isDeleted: false }, { userRole: "user" }] })

        if (!checkAdmin) {
            if (idFromToken !== userId) {
                return res.status(401).send({ Status: 1010, message: "Unauthorized Access! You dont have correct privilege to perform this operation" });
            }
        }

        next()
    }
    catch (err) {

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};

//========================================UpdateBlog==========================================================//

const updateABlog = async function (req, res, next) {
    try {

        let blogId = req.params.blogId

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }

        const verifiedtoken = req.verifiedtoken
        let roleFromToken = verifiedtoken.userRole

        if (roleFromToken !== "admin") {
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

//========================================Deleteblog==========================================================//

const deleteABlog = async function (req, res, next) {
    try {

        let blogId = req.params.blogId

        if (!blogId) {
            return res.status(422).send({ status: 1002, message: "Please enter blog-Id" })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(422).send({ status: 1003, message: "Invalid blog-Id" })
        }

        const verifiedtoken = req.verifiedtoken
        let roleFromToken = verifiedtoken.userRole

        if (roleFromToken !== "admin") {
            return res.status(401).send({ Status: 1010, message: "Unauthorized Access! You dont have correct privilege to perform this operation" });
        }

        next()
    }
    catch (err) {

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};


export { createAdmin, adminLogin, updateAdmin, getAllUser, deleteAdmin, updateABlog, deleteABlog }

