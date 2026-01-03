import { ConnectDB } from "../../lib/config/db"
import ExpenseModel from "../../lib/models/Expenses";
const { NextResponse } = require("next/server")



export async function GET(request){

    await ConnectDB();
    
    const userId = await request.nextUrl.searchParams.get("id");
    const expenses = await ExpenseModel.find({userId});
    return NextResponse.json({expenses})
}

export async function POST(request) {
  try {
    
    await ConnectDB();
    
    const formData = await request.json();
    
    const expenseData = {
      userId: formData.userId,
      type: formData.type,
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date ? formData.date : '', 
      time: formData.time ? formData.time : '',
    };

    const newExpense = await ExpenseModel.create(expenseData);
    const expenseToSend = newExpense.toJSON();
    // console.log("Expense saved:", expenseToSend);

    return new Response(JSON.stringify({
        success: true,
        expense: expenseToSend 
    }), { status: 201 });

  } catch (error) {

    return NextResponse.json(
      { success: false, msg: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {

    await ConnectDB();
    const userid = await request.nextUrl.searchParams.get("userId");
    const id = await request.nextUrl.searchParams.get("id");
    await ExpenseModel.findOneAndDelete({ 
        userId: userid, 
        _id: id 
    });
    return NextResponse.json({
        success: true,
        msg: "Deleted Successfully",
    })
} 

export async function PUT(request) {
    
    await ConnectDB();
    
    const userid = await request.nextUrl.searchParams.get("userId");
    const id = await request.nextUrl.searchParams.get("id");
    // console.log(id);
    const updateData = await request.json();
    // console.log(updateData);
    const updatedData = await ExpenseModel.findOneAndUpdate(
        { userId: userid, _id: id, },
        updateData, 
        {new:true}
    )
    console.log(updatedData);
    const expenseToSend = updatedData.toJSON();
    return NextResponse.json({
        success: true,
        expense: expenseToSend 
    });
    
}