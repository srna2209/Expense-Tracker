import mongoose from "mongoose"; 

const Schema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type: String,
        required:true
    },
    time:{
        type: String,
        required:true 
    }
})

const ExpenseModel= mongoose.models.Expense  || mongoose.model('Expense',Schema);

export default ExpenseModel;