import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import { ApiError } from './ApiError.js';




      cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    const uploadOnCloudinary = async (localFilePath) =>{
        try {
            if(!localFilePath)return null;
            //upload file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            //file is now uploaded
            //console.log("file uploaded",response.url)
            fs.unlinkSync(localFilePath);
            return response;
            
        } catch (error) {
            fs.unlinkSync(localFilePath)
            return null;
            
        }
    }

export const deleteFromCloudinary = async(publicId) => {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result;
            
        } catch (error) {
            console.error("Cloudinary deletion error:", error);
    throw new ApiError(500, error.message || "Failed to delete image from Cloudinary");
            
        }
    }

export default uploadOnCloudinary
