import mongoose from "mongoose";
import Comment from "./comment.js";

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        likes: { type: Number, default: 0 },
        comments: {
            type: mongoose.Schema.Types.Object,
            ref: 'comment',
        },
        date: { type: Date, default: Date.now() },
        userId: { type: String, required: false },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date }
    },
    { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);

export default Blog;
