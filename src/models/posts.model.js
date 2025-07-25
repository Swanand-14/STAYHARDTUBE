import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    content:{
        type:String,
        maxlength:1000,
    },
    image:{
        type:String,
    },
    tags:[
        {
            type:String,
        }
    ],
    owner:{
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
    createdAt:{
        type:Date,
        default:Date.now
    },
});

export const Post = mongoose.model("Post",postSchema);