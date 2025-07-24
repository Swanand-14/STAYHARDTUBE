import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { View } from "../models/View.model.js";
import { Like } from "../models/likes.model.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { Inspiration } from "../models/inspirations.model.js";



export const uploadVideoAndThumbnail = asyncHandler(async(req,res)=>{
    const {title,description,tags=[]} = req.body
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
        tags,
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
    const {title,description,tags} = req.body
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
    if(tags && Array.isArray(tags)){
        video.tags = tags;
    }
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

export const getSingleVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid Video ID")
    }

    const video  = await Video.findById(videoId).populate("owner","username fullname avatar").lean();
    if(!video){
        throw new ApiError(404,"Video not found")
    }

    return res.status(200).json(new ApiResponce(200,video,"Video Fetched successfuly"))

})


export const getAllVideos = asyncHandler(async(req,res)=>{
    const videos = await Video.find({isPublished:true}).sort({createdAt:-1}).select("-__v");
    res.status(200).json(
        new ApiResponce(200,videos,"All videos fetched successfully")
    );

})

export const addViewToVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const userId = req.user._id
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video does not exist")
    }
    const alreadyViewed = await View.findOne({video:videoId,user:userId});
    if(!alreadyViewed){
        await View.create({video:videoId,user:userId});
        video.views+=1
        await video.save();
        await User.findByIdAndUpdate(userId,{
            $addToSet:{watchhistory:video._id}
        });

    }

    return res.status(200).json(new ApiResponce(200,{views:video.views},"View recorded succesfully"))

})

export const toggleLikeDislike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {type} = req.body

    if(!["like","dislike"].includes(type)){
        throw new ApiError(400,"Type must be like or dislike")
    }
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Video Id Invalid")
    }
    const userId = req.user._id
    const existing = await Like.findOne({user:userId,video:videoId})
    if(!existing){
        await Like.create({user:userId,video:videoId,type});
        return res.status(200).json(new ApiResponce(200,{},`Video ${type} succesfully`));
    }
    if(existing.type===type){
        await Like.deleteOne({_id:existing._id});
        return res.status(200).json(new ApiResponce(200,{},`${type} removed successfully`))
    }

    existing.type = type
    await existing.save();
    return res.status(200).json(new ApiResponce(200,{},`Video ${type}d successfully`))
})

export const getVideoReactons = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const userId = req.user._id
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }
    const [likesCount,dislikeCount,userReaction] = await Promise.all(
        [
            Like.countDocuments({video:videoId,type:"like"}),
            Like.countDocuments({video:videoId,type:"dislike"}),
            Like.findOne({video:videoId,user:userId})
        ]
    );
    return res.status(200).json(new ApiResponce(200,{likes:likesCount,dislikes:dislikeCount,
        userReaction:userReaction?.type || null,
    },"Reaction data fetched"))
})

export const getChannelVideos = asyncHandler(async(req,res)=>{
    const {channelId} = req.params
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400,"Invalid Channel Id")
    }
    const videos = await Video.find({
        owner:channelId,
        isPublished:true
    }).sort({createdAt:-1})
    .select("title thumbnail views createdAt")
    .lean();

    return res.status(200).json(new ApiResponce(200,videos,"Fetched channel's videos"))



})
export const getSubscriptionFeed = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const subscriptions = await Subscription.find({subscriber:userId}).select("channel");
    const channelIds = subscriptions.map((sub)=>sub.channel)
    const videos = await Video.find({owner:{$in:channelIds}}).sort({createdAt:-1})
    .populate("owner","username fullname avatar").lean()
    return res.status(200).json(new ApiResponce(200,videos,"Fetched videos from subcribed channels"))
})

export const searchVideos = asyncHandler(async(req,res)=>{
    const searchQuery = req.query.query;

if (typeof searchQuery !== "string" || !searchQuery.trim()) {
  return res.status(400).json({
    success: false,
    message: "Search query is required",
  });
}


    const videos = await Video.find({
        title:{
            $regex:searchQuery,$options:"i"
        },
        isPublished:true
    }).populate("owner","username fullname avatar")
    .select("title thumbnail views createAt owner")
    .sort({createdAt:-1})
    .lean()

    return res.status(200).json(new ApiResponce(200,videos,"Search Results"))
})

export const getTrendingVideos = asyncHandler(async(req,res)=>{
    const videos = await Video.find({isPublished:true})
    .sort({views:-1})
    .limit(10)
    .populate("owner","username fullname avatar")
    .lean()

    return res.status(200).json(new ApiResponce(200,videos,"Trending videos fetched successfully"))

})

export const getVideoByTag = asyncHandler(async(req,res)=>{
    const {tag} = req.params;
    if(!tag){
        throw new ApiError(400,"Tag is required")
    }
    const videos = await Video.find({
        tags:tag,
        isPublished:true
    }).sort({
        createdAt:-1
    })
    .populate("owner","username fullname avatar")
    .lean();
    const inspirations = await Inspiration.find({tags:tag}).lean();

    return res.status(200).json(new ApiResponce(200,{videos,inspirations},`Video with tag ${tag} fetched successfully`))
})

export const getAllTags = asyncHandler(async(req,res)=>{
    const tags = await Video.distinct("tags");
    return res.status(200).json(new ApiResponce(200,tags,"All tags fetched"));
})











