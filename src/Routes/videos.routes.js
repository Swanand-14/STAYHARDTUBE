import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {addViewToVideo, deleteVideo, getAllVideos, getChannelVideos, getSingleVideo, getSubscriptionFeed, getTrendingVideos, getVideoByTag, getVideoReactons, searchVideos, toggleLikeDislike, updateVideoDetails, uploadVideoAndThumbnail} from "../controllers/videos.controller.js";








const videoRouter = Router();

videoRouter.route("/upload").post(verifyJWT,upload.fields([
    {name:"videoFile",maxCount:1},
    {name:"thumbnail",maxCount:1},
]),uploadVideoAndThumbnail)
videoRouter.route("/search").get(searchVideos)
videoRouter.route("/trending").get(getTrendingVideos)
videoRouter.route("/:videoId").delete(verifyJWT,deleteVideo)
videoRouter.route("/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideoDetails)
videoRouter.route("/:videoId").get(getSingleVideo)
videoRouter.get("/",getAllVideos)
videoRouter.route("/:videoId/add-view").post(verifyJWT,addViewToVideo)
videoRouter.route("/:videoId/reaction").post(verifyJWT,toggleLikeDislike)
videoRouter.route("/:videoId/reaction").get(verifyJWT,getVideoReactons)
videoRouter.route("/channel/:channelId").get(verifyJWT,getChannelVideos)
videoRouter.route("/feed/subscription").get(verifyJWT,getSubscriptionFeed)
videoRouter.route("/tag/:tag").get(getVideoByTag)




export default videoRouter


