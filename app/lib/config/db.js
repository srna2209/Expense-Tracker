import mongoose from "mongoose";

let isConnected = false;

export const ConnectDB = async () => {
    if(isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    // console.log('DB connected');
} 



