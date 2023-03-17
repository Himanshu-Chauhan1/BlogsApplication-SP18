import express from "express";
const adminRouter = express.Router();
import { create, login, logout, update, index, destroy, updateABlog, deleteABlog, getCommentsByFilter } from "../controllers/admin.js"
import { createAdmin, adminLogin, getAllUser, updateAdmin, deleteAdmin } from '../validators/admin.js'
import { authentication } from '../middleware/authentication.js'
import { authorization } from '../middleware/authorization.js'

adminRouter.post('/admin', [createAdmin], create);
adminRouter.post('/admin/login', [adminLogin], login);
adminRouter.post('/admin/logout', logout);
adminRouter.put('/admin/:id', [authentication, authorization, updateAdmin], update);
adminRouter.get('/admin/users', [authentication, authorization, getAllUser], index);
adminRouter.delete('/admin/:id', [authentication, authorization, deleteAdmin], destroy);
adminRouter.put('/admin/blogs/:blogId', [authentication, authorization, updateABlog], updateABlog);
adminRouter.delete('/admin/blogs/:blogId', [authentication, authorization, deleteABlog], deleteABlog);
adminRouter.get('/blogs/comments', [authentication, authorization], getCommentsByFilter);


export default adminRouter