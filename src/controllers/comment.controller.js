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

export const getCommentsByVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"Video Id is required")
    }
    const comments = await Comment.find({video:videoId})
    .populate("user","username avatar")
    .sort({createdAt:-1});

    return res.status(200).json(new ApiResponce(200,comments,"Comments fetched successfuly"))
})

export const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400,"Invalid comment id")
    }
    if(comment.user.toString()!==req.user._id.toString()){
        throw new ApiError(400,"U are not Authorised to delete this comment")
    }
    await comment.deleteOne();
    return res.status(200).json(new ApiResponce(200,null,"Comment deleted successfully"))
})

export const updateComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const {content} = req.body
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400,"Comment not found")
    }
    if(comment.user.toString()!==req.user._id.toString()){
        throw new ApiError(400,"You are not authorised to delete this comment")
    }
    comment.content = content;
    await comment.save();
    return res.status(200).json(new ApiResponce(200,comment,"Comment updated"));
})

export const toggleLikeComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const userId = req.user._id;
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }
    const liked = comment.likes.some(id=>id.toString() === userId.toString());
    if(liked){
        comment.likes.pull(userId);
    }
    else{
        comment.likes.push(userId)
    }

    await comment.save();
    return res.status(200).json(new ApiResponce(200,comment,liked?"Unliked":"Liked"));


})


// 6875ed54f0fa38c48834480d