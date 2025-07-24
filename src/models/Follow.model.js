// models/follow.model.js
import mongoose, { Schema } from "mongoose";

const followSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    inspiration: {
        type: Schema.Types.ObjectId,
        ref: "Inspiration",
        required: true,
    },
}, { timestamps: true });
followSchema.index({user:1,inspiration:1},{unique:true});

export const Follow = mongoose.model("Follow", followSchema);