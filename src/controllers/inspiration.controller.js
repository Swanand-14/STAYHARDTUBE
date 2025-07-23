import { Inspiration } from "../models/inspirations.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
export const createInspiration = asyncHandler(async(req,res)=>{
    const {fullname,tags,bio,links} = req.body;
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file not found")
    }

    

    const exists = await Inspiration.findOne({fullname:fullname.trim().toLowerCase()});
    if(exists) throw new ApiError(400,"Already an inspiration user")
    const avatarfile = await uploadOnCloudinary(avatarLocalPath);

    const newInspo = await Inspiration.create({
        fullname,
        tags,
        bio,
        links,
        avatar:avatarfile.url
    });
    return res.status(200).json(new ApiResponce(200,newInspo,"Inspiration created successfully"));

})

export const  getAllInspirations = asyncHandler(async(req,res)=>{
  const inspirations = await Inspiration.find();
  return res.status(200).json(new ApiResponce(200,inspirations,"All inspirations fetched "))
})