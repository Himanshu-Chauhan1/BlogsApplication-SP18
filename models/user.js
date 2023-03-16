import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const nodeKey = process.env.NODE_KEY

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: Number, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: {
            type: String,
            required: true,
            trim: true,
            minLen: 8,
            maxLen: 15,
        },
        userRole: {
            type: String,
            default: "user"
        },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date }
    },
    { timestamps: true }
);


userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password + nodeKey, salt);
    next();
});

const User = mongoose.model("user", userSchema);

export default User;
