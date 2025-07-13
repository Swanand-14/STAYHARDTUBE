import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";


export const uploadVideoAndThumbnail = asyncHandler(async(req,res)=>{
    const {title,description} = req.body
    if(!title || !description){
        throw new ApiError(400,"Title and Description are required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail and Video file required")
    }

    const uploadVideo = await uploadOnCloudinary(videoLocalPath)
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!uploadVideo?.url || !uploadThumbnail.url){
        throw new ApiError(500,"Error while uploading video or thumbail ")
    }

    const video = await Video.create({
        title,
        description:description,
        videoFile:uploadVideo.url,
        thumbnail:uploadThumbnail.url,
        owner:req.user._id,
    })

    return res.status(200).json(new ApiResponce(200,video,"Video uploaded successfully"))


    
})

export const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid video ID")
    }
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400,"Video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400,"You are not authorized to delete this video")
    }

    await video.deleteOne();

    return res.status(200).json(new ApiResponce(200,{},"Video deleted Succesfully"))

})

export const updateVideoDetails = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {title,description} = req.body
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Video invalid")
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"Video Not Found")
    }

    if(video.owner.toString() !== req.user._id.toString()){
       throw new ApiError(403,"You are not authorised to update the video")
    }

    if(title) video.title = title;
    if(description) video.description = description;
    const newThumbnailLocalPath = req.file?.path;
    if(newThumbnailLocalPath){
        const publicId = video.thumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
        const newThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);
        if(!newThumbnail?.url || !newThumbnail?.public_id){
            throw new ApiError(500,"Error uploading new thumbnail");
        }

        video.thumbnail = newThumbnail.url

            
        
    }

    console.log("thumbnail",req.file?.path);

    await video.save();

    return res.status(200).json(new ApiResponce(200,video,"Video details updated successfuly"))



})