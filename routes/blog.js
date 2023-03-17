import express from "express";
const blogRouter = express.Router();
import { create, update, get, index, destroy } from "../controllers/blog.js"
import { createBlog, updateBlog, getAllBlogs, deleteBlog} from '../validators/blog.js'
import { authentication } from '../middleware/authentication.js'
import { authorization } from '../middleware/authorization.js'

blogRouter.post('/blogs', [authentication, createBlog], create);
blogRouter.put('/blogs/:blogId', [authentication, authorization, updateBlog], update);
blogRouter.get('/blogs/:blogId', get);
blogRouter.get('/blogs', [getAllBlogs], index);
blogRouter.delete('/blogs/:blogId', [authentication, authorization, deleteBlog], destroy);


export default blogRouter