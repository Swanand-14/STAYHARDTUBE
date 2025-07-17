import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";

export const postComment = asyncHandler(async(req,res)=>{
    const {videoId,content} = req.body;
    if(!videoId || !content){
        throw new ApiError(400,"Both video ID and content are required")

    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"Video Not Found")
    }
    const comment = await Comment.create({
        content,
        video:videoId,
        user:req.user._id,
    });

    return res.status(201).json(new ApiResponce(200,comment,"Comment Added Successfully"));

})