import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";


export const uploadVideo = asyncHandler(async(req,res)=>{
    const {title,description} = req.body
    if(!title || !description){
        throw new ApiError(400,"Title and Description are required")
    }

    
})