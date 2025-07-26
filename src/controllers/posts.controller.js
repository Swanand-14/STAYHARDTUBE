import { Post } from "../models/posts.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createPost = asyncHandler(async(req,res)=>{
    const {content,tags} = req.body;
    const imageLocalPath = req.files?.image?.[0]?.path;
    if(!imageLocalPath){
        throw new ApiError(400,"Image file not found")
    }
    const image = await uploadOnCloudinary(imageLocalPath)
    const post = await Post.create({
        content,
        image:image.url,
        tags,
        owner:req.user._id,
    });

    return res.status(200).json(new ApiResponce(201,post,"Post created succesfully"));
});

export const getPostsFeed = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const connections = await Subscription.find({subscriber:userId}).select("channel")
    const ConnectedUsersIds = connections.map((con)=>con.channel)
    const Posts = await Post.find({owner:{$in:ConnectedUsersIds}}).sort({createdAt:-1})
    .populate("owner","fullname avatar")
    .lean()

    return res.status(200).json(new ApiResponce(200,Posts,"Post fectched successfully"))


})

export const toggleLikePost = asyncHandler(async(req,res)=>{
    const {postId} = req.params
    const userId = req.user._id

    const post = await Post.findById(postId)
    if(!post)throw new ApiError(400,"Post not found")

    const alreadyLiked = post.likes.includes(userId);
    if(alreadyLiked){
        post.likes.pull(userId);
    }
    else{
        post.likes.push(userId)
    }

    await post.save()

    return res.status(200).json(new ApiResponce(200,{likes:post.likes.length},"Post like status updated"))

})





