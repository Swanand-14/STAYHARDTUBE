import mongoose,{Schema} from 'mongoose'
const viewSchema = new Schema({
    video : {
        type:Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    watchedAt:{
        type:Date,
        default:Date.now
    }

},{timestamps:true});

viewSchema.index({video:1,user:1},{unique:true});
export const View = mongoose.model("View",viewSchema);