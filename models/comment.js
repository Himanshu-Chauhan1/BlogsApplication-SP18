import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date }
    },
    { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
