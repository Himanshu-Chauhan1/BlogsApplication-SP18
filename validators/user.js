import mongoose from "mongoose";
import { User } from '../models/index.js'


////////////////////////// -GLOBAL- //////////////////////
const isValid = function (value) {
    if (!value || typeof value != "string" || value.trim().length == 0)
        return false;
    return true;
};

////////////////////////// -GLOBAL- //////////////////////
const isValidNumber = function (value) {
    if (!value || typeof value != "number")
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

const createUser = async function (req, res, next) {
    try {
        const data = req.body

        const { name, phone, email, password } = req.body

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

        const isRegisteredphone = await User.findOne({ phone }).lean();

        if (isRegisteredphone) {
            return res.status(422).send({ status: 1008, message: "phoneNo. number already registered" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: 1002, message: "Email is required" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: 1003, message: "plz enter a valid Email" })
        }

        const isRegisteredEmail = await User.findOne({ email }).lean();
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

        next()

    } catch (error) {
        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
}

//========================================LoginUser==========================================================//

let userLogin = async (req, res, next) => {
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

//========================================DeleteUser==========================================================//

const deleteTheUser = async function (req, res, next) {
    try {

        let userId = req.params.userid

        if (!userId) {
            return res.status(422).send({ status: 1002, message: "Please enter user-Id" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(422).send({ status: 1003, message: "Invalid user-Id" })
        }

        next()
    }
    catch (err) {

        return res.status(422).send({ status: 1001, msg: "Something went wrong Please check back again" })
    }
};


export { createUser, userLogin, deleteTheUser }

