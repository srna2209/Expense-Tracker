import mongoose from "mongoose";

let isConnected = false;

export const ConnectDB = async () => {
    if(isConnected) return;
    await mongoose.connect('mongodb+srv://srna2209:22092209@cluster0.gihycc7.mongodb.net/Expense-app');
    isConnected = true;
    // console.log('DB connected');
} 



