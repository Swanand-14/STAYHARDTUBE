import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

export const subscribeChannel = asyncHandler(async(req,res)=>{
    const subsciberId = req.user._id
    const channelId = req.params.channelId
    if(subsciberId.toString() === channelId){
        throw new ApiError(400,"You cannot subscribe to your own channel")

    }

    const existingSub = await Subscription.findOne({
        subscriber:subsciberId,
        channel:channelId
    })
    if(existingSub){
        throw new ApiError(400,"You have already subscribed to the channel")
    }
    const newSub = Subscription.create({
        subscriber:subsciberId,
        channel:channelId
    });
    return res.status(201).json(
        new ApiResponce(200,newSub,"Subscibed successfully")
    );

});

export const unsubscirbeFromChannel = asyncHandler(async(req,res)=>{
    const channelId = req.params.channelId
    const subsciberId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
  throw new ApiError(400, "Invalid channel ID");
}
const deletedSub = await Subscription.findOneAndDelete({
    channel:channelId,
    subscriber:subsciberId
})

if(!deletedSub){
    throw new ApiError(400,"Subscription not found")

}

return res.status(200).json(new ApiResponce(200,{},"Unsubscribed Successfully"))

})

export const getSubscibedChannelList = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const subscriptions = await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channelDetails",
            },
           
        },
        {
            $unwind:"$channelDetails"
        },
        {
            $project:{
                _id:0,
                fullname:"$channelDetails.fullname",
                username:"$channelDetails.username",
                avatar:"$channelDetails.avatar",
            }
        }
    ])

    return res.status(200).json(new ApiResponce(200,subscriptions,"Fetched subscribed channels"));
})