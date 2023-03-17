import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'blog',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        like: { type: Boolean, required: true },
        date: { type: Date, default: Date.now() },
    },
    { timestamps: true }
);

const Like = mongoose.model("like", likeSchema);

export default Like;
