import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { getSubscibedChannelList, subscribeChannel, unsubscirbeFromChannel } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.route("/:channelId").post(verifyJWT,subscribeChannel)
subscriptionRouter.route("/:channelId").delete(verifyJWT,unsubscirbeFromChannel)
subscriptionRouter.route("/subscribed-channels").get(verifyJWT,getSubscibedChannelList)

export default subscriptionRouter
