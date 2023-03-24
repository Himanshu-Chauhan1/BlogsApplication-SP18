import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now() },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'like'
        }],
        role: { type: String, default: "user" },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date }
    },
    { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);

export default Blog;
