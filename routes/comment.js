import express from "express";
const commentRouter = express.Router();
import { create, update, get, destroy } from "../controllers/comment.js"
import { createComment, updateComment, getAllCommentsByBlogId, deleteComment } from '../validators/comment.js'
import { authentication } from '../middleware/authentication.js'
import { authorization } from '../middleware/authorization.js'

commentRouter.post('/blogs/:blogId/comments', [authentication, authorization, createComment], create);
commentRouter.put('/blogs/:blogId/comments/:commentId', [authentication, authorization, updateComment], update);
commentRouter.get('/blogs/:blogId/comments', [getAllCommentsByBlogId], get);
commentRouter.delete('/blogs/:blogId/comments/:commentId', [authentication, authorization, deleteComment], destroy);


export default commentRouter