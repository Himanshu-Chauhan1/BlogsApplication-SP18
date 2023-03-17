import express from "express";
const userRouter = express.Router();
import { create, login, logout, update, destroy } from "../controllers/user.js"
import { createUser, userLogin, updateUser, deleteTheUser } from '../validators/user.js'
import { authentication } from '../middleware/authentication.js'
import { authorization } from '../middleware/authorization.js'

userRouter.post('/users', [createUser], create);
userRouter.post('/users/login', [userLogin], login);
userRouter.post('/users/logout', logout);
userRouter.put('/users/:id', [authentication, authorization, updateUser], update);
userRouter.delete('/users/:id', [authentication, authorization, deleteTheUser], destroy);

export default userRouter