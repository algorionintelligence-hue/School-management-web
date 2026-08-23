import mongoose from 'mongoose'

const connectDatabase = async () => {
    try {
        await mongoose.connect(env.mongodbUri);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        process.exit(1);
    }
};

module.exports = connectDatabase;