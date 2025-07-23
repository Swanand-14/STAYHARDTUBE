import mongoose, { Schema } from "mongoose";
const inspirationSchema = new Schema({
    fullname:{
        type:String,
        required:true
    },
    tags:[String],
    bio:String,
    links:[String],
    avatar:{
        type:String,
        required:true,
    }

},{timestamps:true});

export const Inspiration = mongoose.model("Inspiration",inspirationSchema);
