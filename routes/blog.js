import express from "express";
const blogRouter = express.Router();
import { create, update, index, destroy, like } from "../controllers/blog.js"
import { createBlog, updateBlog, getAllBlogs, deleteBlog, createLike } from '../validators/blog.js'
import { authentication } from '../middleware/authentication.js'
import { authorization } from '../middleware/authorization.js'

blogRouter.post('/blogs/create', [authentication, createBlog], create);
blogRouter.put('/blogs/update/:blogId', [updateBlog], update);
blogRouter.get('/blogs/get', [getAllBlogs], index);
blogRouter.delete('/blogs/delete/:blogId', [deleteBlog], destroy);
blogRouter.post('/blogs/:blogId/likes/create', [authentication, createLike], like);


export default blogRouter