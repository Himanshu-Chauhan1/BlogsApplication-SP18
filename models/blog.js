import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        like: { type: mongoose.Schema.Types.Object, ref: 'like' },
        date: { type: Date, default: Date.now() },
        comment: { type: mongoose.Schema.Types.Object, ref: 'comment' },
        userId: { type: String, required: false },
        role: { type: String, default: "user" },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date }
    },
    { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);

export default Blog;
