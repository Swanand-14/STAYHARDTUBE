import { Router } from "express";

import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { postComment } from "../controllers/comment.controller.js";

const commentRouter = Router();
commentRouter.post("/",verifyJWT,postComment)

export default commentRouter;
