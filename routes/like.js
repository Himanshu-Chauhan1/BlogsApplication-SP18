import express from "express";
const likeRouter = express.Router();
import { create, update, index } from "../controllers/like.js"
import { createLike, getAllLikes, updateLike } from '../validators/like.js'
import { authentication } from '../middleware/authentication.js'
import { authorization } from '../middleware/authorization.js'

likeRouter.post('/blogs/:blogId/likes', [authentication, authorization, createLike], create);
likeRouter.put('/blogs/:blogId/:likeId', [authentication, authorization, updateLike], update);
likeRouter.get('/blogs/:blogId/likes', [getAllLikes], index);


export default likeRouter