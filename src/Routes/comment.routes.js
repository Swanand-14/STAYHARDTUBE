import { Router } from "express";

import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { deleteComment, getCommentsByVideo, postComment, replyToComment, toggleLikeComment, updateComment } from "../controllers/comment.controller.js";

const commentRouter = Router();
commentRouter.post("/",verifyJWT,postComment)
commentRouter.route("/:videoId").get(getCommentsByVideo)
commentRouter.route("/:commentId").delete(verifyJWT,deleteComment)
commentRouter.route("/:commentId").post(verifyJWT,updateComment)
commentRouter.route("/toggle-like/:commentId").post(verifyJWT,toggleLikeComment)
commentRouter.route("/reply/:parentCommentId").post(verifyJWT,replyToComment)
export default commentRouter;
// 687333fb3c10344bcb789e27
