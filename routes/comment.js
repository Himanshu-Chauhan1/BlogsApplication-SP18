import express from "express";
const commentRouter = express.Router();
import { create, update, destroy } from "../controllers/comment.js"
import { createComment, updateComment, deleteComment } from '../validators/comment.js'
import { authentication } from '../middleware/authentication.js'
import { authorization } from '../middleware/authorization.js'

commentRouter.post('/comments/:blogId/create', [authentication, createComment], create);
commentRouter.put('/comments/:blogId/update/:commentId', [updateComment], update);
commentRouter.delete('/comments/:blogId/delete/:commentId', [deleteComment], destroy);


export default commentRouter