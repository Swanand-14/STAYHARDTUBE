 import { asyncHandler } from "../utils/asyncHandler.js";
 import { ApiError } from "../utils/ApiError.js";
 import { User } from "../models/user.model.js";
 import uploadOnCloudinary from '../utils/cloudinary.js'
 import { ApiResponce } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const {TokenExpiredError} = jwt;

const generateAccessAndRefreshToken = async(userId)=>{
    try {
      const user =    await User.findById(userId)
      const AccessToken = user.generateAccessToken()
      const RefreshToken = user.generateRefreshToken()
      user.refreshToken = RefreshToken
      await user.save({validateBeforeSave:false})
      return {AccessToken,RefreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while genrating refersh and access token")
    }
}
 const registerUser = asyncHandler(async(req,res)=>{
    //step 1 - get user details from frontend
    //2 - validation
    //3 check if user already exists:username,exail
    //check for images ,check for avatar
    //upload to cloudinary
    //create user object for mongoose- create entry in db
    //remove passowrd and refresh token field from response
    // check for user creation
    //return res
    const {fullname,email,username,password} = req.body;
    console.log("email",email);
    if([fullname,username,password,email].some((field)=>
    field.trim() === "")
        
    ){
        throw new ApiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
       throw new ApiError(409,"User with email or username already exists") 
    }

    console.log("req.body:", req.body);
console.log("req.files:", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
        coverImageLocalPath = req.files.coverimage[0].path
    }
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
        
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const Cover = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverimage:Cover?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponce(200,createdUser,"Succesfully registered")
    )


    

 })

 const loginUser = asyncHandler(async(req,res)=>{
    // steps-
    // req body data fetch
    // username and email Authentication
    // paswword check
    // access and refresh 
    // send cookie

    const {username,email,password} = req.body
    if(!username && !email){
        throw new ApiError(400,"username or email is required")

    }
   const user = await User.findOne({
      
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }
   const isPasswordValid =  await user.isPasswordCorrect(password)
   if (!isPasswordValid){
    throw new ApiError(401,"Invalid password")
   }

  const {AccessToken,RefreshToken} =  await generateAccessAndRefreshToken(user._id)
 const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
 const options = {
    httpOnly: true,
    secure : true
 }
 return res
 .status(200)
 .cookie("AccessToken",AccessToken,options)
 .cookie("RefreshToken",RefreshToken,options)
 .json(
    new ApiResponce(200,{
        user:loggedInUser,AccessToken,RefreshToken
    },"User logged In Successfully!"
)
 )

 


 })

 const logoutUser = asyncHandler(async(req,res) =>{
    const userId = req.user._id
    await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const options = {
    httpOnly: true,
    secure : true
 }

 return res.status(200).clearCookie(
    "AccessToken",options
 ).clearCookie("RefreshToken",options)
 .json(new ApiResponce(200,{},"User logout"))


 })

const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRefreshToken =  req.cookies.RefreshToken || req.body.RefreshToken
   if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorised request")

   }
   try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)
    if(!user){
     throw new ApiError(401,"Invalid refresh Token")
 
    }
 
    if(incomingRefreshToken!== user?.refreshToken){
     throw new ApiError(401,"refresh token expired or used")
    }
    const options = {
     httpOnly:true,
     secure:true
    }
   const {AccessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)
 
   return res.status(200)
   .cookie("AccessToken",AccessToken,options)
   .cookie("RefreshToken",newRefreshToken,options)
   .json(
     new ApiResponce(200,
         {
             AccessToken,
             refreshToken:newRefreshToken
         },
         "Access token refreshed"
     )
 
   )
   } catch (error) {
    throw new ApiError(401,"Invalid refresh Token")
   }

})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body;
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect  = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")

    }
    user.password = newPassword;
   await user.save()
   return res.status(200).json(new ApiResponce (200,{},"Password changed succesfully"))
     
})

const getCurrentUser = asyncHandler((req,res)=>{
  return res.status(200).json(200,req.user,"current user fetched successfully")

})
const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname,email} = req.body
    if(!fullname || !email){
        throw new ApiError(400,"All fields are required")
    }
    const user = User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            fullname:fullname,
            email:email
        }
    },
    {new:true}

).select("-password")
return res.status(200).json(new ApiResponce(200,user,"Account Details Updated"))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar missing")

    }
    const avatar = uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        ApiError(400,"Error while Uploading to Cloudinary")

    }
    const user = await User.findByIdAndUpdate(req.user?._id,{$set:{
avatar:avatar.url
    }},{
        new:true
    }).select("-password")
    return res.status(200).json(new ApiResponce(200,user,"Updated Avatar Image successfuly"))
     
})

const UpdateCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover image path not available")
    }
    const Cover = await uploadOnCloudinary(coverImageLocalPath)
    if(!Cover){
        throw new ApiError(400,"Error while uploading file")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            coverimage:Cover.url
        }
    },{
        new:true
    }).select("-passowrd")

    return res.status(200).json(new ApiResponce(200,user,"Updated Cover Image successfuly"))
})


 
 export {registerUser,loginUser,logoutUser,refreshAccessToken,UpdateCoverImage,updateUserAvatar} 
 