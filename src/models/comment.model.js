import mongoose, { Schema } from "mongoose";
const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true,
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default:null,
    },
    replies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",

    }
    
    
   
},{timestamps:true});

export const Comment = mongoose.model("Comment",commentSchema);