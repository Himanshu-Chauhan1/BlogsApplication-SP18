import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = { dbName: "BlogSP18" }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS, { useNewUrlParser: true })
        console.log("MongoDB is connected Successfully");
    } catch (err) {
        console.log(err.message)
    }
}

export default connectDB