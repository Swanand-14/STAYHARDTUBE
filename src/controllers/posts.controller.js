import { Post } from "../models/posts.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPost = asyncHandler(async(req,res)=>{
    const {content,image,tags} = req.body;
    const post = await Post.create({
        content,
        image,
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



