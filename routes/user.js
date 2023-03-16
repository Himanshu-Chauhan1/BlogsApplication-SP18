import express from "express";
const userRouter = express.Router();
import { create, login, logout, updateUser, getAllUsers, deleteUser } from "../controllers/user.js"
import { createUser, userLogin, deleteTheUser } from '../validators/user.js'
import { authentication } from '../middleware/authentication.js'
import { authorization } from '../middleware/authorization.js'

userRouter.post('/users/register', [createUser], create);
userRouter.post('/users/login', [userLogin], login);
userRouter.post('/users/logout', logout);
userRouter.put('/users/:userId', updateUser);
userRouter.get('/users/get', getAllUsers);
userRouter.delete('/users/delete/:userid', [authentication, authorization, deleteTheUser], deleteUser);


export default userRouter