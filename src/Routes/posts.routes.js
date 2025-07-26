import express from 'express'
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { createPost, getPostsFeed, toggleLikePost } from '../controllers/posts.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const postsRouter = express.Router()
postsRouter.route('/add-post').post(verifyJWT,upload.fields([{name:"image",maxCount:1}]),createPost)
postsRouter.route("/get-posts").get(verifyJWT,getPostsFeed)
postsRouter.route("/like/:postId").post(verifyJWT,toggleLikePost)
export default postsRouter