import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js";
import {changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, registerUser, toggleWatchLater, updateAccountDetails, UpdateCoverImage, updateUserAvatar} from "../controllers/user.controller.js";
import {loginUser} from '../controllers/user.controller.js'
import { logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
const userRouter = Router();
userRouter.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    },
{
    name:"coverImage",
    maxCount:1
}]),
    registerUser)
userRouter.route("/login").post(loginUser)
//secured routes
userRouter.route("/logout").post(verifyJWT,logoutUser)


userRouter.route("/refresh-token").post(refreshAccessToken)
userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)
userRouter.route("/current-user").get(verifyJWT,getCurrentUser)
userRouter.route("/update-account").patch(verifyJWT,updateAccountDetails)
userRouter.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
userRouter.route("/cover-image").patch(verifyJWT,upload.single("coverimage"),UpdateCoverImage)
userRouter.route("/c/:username").get(verifyJWT,getUserChannelProfile)
userRouter.route("/history").get(verifyJWT,getWatchHistory)
userRouter.route("/watchlater/:videoId").post(verifyJWT,toggleWatchLater)
export default userRouter;