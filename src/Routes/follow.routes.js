import express from 'express'
import { followInspiration, unfollowInspiration } from '../controllers/follow.controller.js'
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const followRouter = express.Router()

followRouter.route("/follow/:inspirationId").post(verifyJWT,followInspiration)
followRouter.route("/unfollow/:inspirationId").delete(verifyJWT,unfollowInspiration)
export default followRouter
//68805e626d4e260f0eb3fe9c