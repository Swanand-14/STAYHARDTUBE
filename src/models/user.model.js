import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
     email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
       
        index:true
    },
    fullname:{
        type:String,
        required:true,
        unique:true,
        
       
        index:true
    },
    avatar:{
        type:String,//cloudnary
        required:true

    },
    coverimage:{
        type:String,


    },
    watchhistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:"String",
        required:[true,'password is required']
    },
    refreshToken:{
        type:String
    },
    role:{
        type:String,
        enum:["user","inspiration","admin"],
        default:"user"
    },
    tags:{
        type:[String],
        default:[],
        validate:{
            validator:function (val){
                if(this.role === 'inspiration') return true;
                return val.length === 0;
            },
            message:'Only inspiration users can have tags'
        }
    }

},{
    timestamps:true
})
userSchema.pre("save",async function (next){
    if(!this.isModified("password"))return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect = async function name(password) {
   return await bcrypt.compare(password,this.password)
    
}
userSchema.methods.generateAccessToken = function(){
   return jwt.sign({
        _id : this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
})
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
        
    },
process.env.REFRESH_TOKEN_SECRET,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
})
}
export const User = mongoose.model("User",userSchema)