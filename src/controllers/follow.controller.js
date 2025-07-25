import { Follow } from "../models/Follow.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const followInspiration = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const {inspirationId} = req.params
    if(!mongoose.Types.ObjectId.isValid(inspirationId)){
        throw new ApiError(400,"Invalid Inspiration Id")

    }

    const existingFollow = await Follow.findOne({user:userId,inspiration:inspirationId})
    if(existingFollow){
        throw new ApiError(400,"Already following this inspiration");
    }
    const follow = await Follow.create({
        user:userId,
        inspiration:inspirationId
    });
    return res.status(200).json(new ApiResponce(201,follow,"Followed inspiration successfully"));
});

export const unfollowInspiration = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const {inspirationId} = req.params
    const unfollow = await Follow.findOneAndDelete(
        {
            user:userId,
            inspiration:inspirationId

        }
    );
    if(!unfollow){
        throw new ApiError(400,"You are not following this inspiration")
    }
    return res.status(200).json(new ApiResponce(200,{},"Unfollowed inspiration successfully"))

})

export const getFollowedInspirations = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const inspirations = await Follow.find({user:userId}).populate
    ("inspiration","fullname avatar tags bio")
    .lean()

    return res.status(200).json(new ApiResponce(200,inspirations,"Followed inspirations fetched"))

})




