import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {deleteVideo, uploadVideoAndThumbnail} from "../controllers/videos.controller.js";








const videoRouter = Router();

videoRouter.route("/upload").post(verifyJWT,upload.fields([
    {name:"videoFile",maxCount:1},
    {name:"thumbnail",maxCount:1},
]),uploadVideoAndThumbnail)

videoRouter.route("/:videoId").delete(verifyJWT,deleteVideo)

export default videoRouter


