import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const VideoSchema = new Schema({
    videoFile:{
        type:String,
        required:true

    },
    thumbnail:{
        type:String,
        required:true
        

    },
    title:{
        type:String,
        required:true

    },
    description:{
        type:String,//cloudnary
        required:true

    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    tags:{
        type:[String]
        
    
    }

},{timestamps:true})
VideoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",VideoSchema)