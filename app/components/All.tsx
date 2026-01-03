'use client'

import React, {useEffect, useState} from "react";
import DashBoard from "./DashBoard";
import ExpenseList from "./ExpenseList";
import Track from "./Track";
import { Expense } from "../page";
import { parse } from 'date-fns'; 
import axios from "axios";
import { Balancetrack } from "./BalanceTrack";
import { IncExpTrack } from "./IncExpTrack";
import TrackByCategory from "./TrackByCategory";

const sortExpenses = (expenses: Expense[]): Expense[] => {
    return [...expenses].sort((a, b) => {
        const dateFormat = "dd MMM yyyy";
        const timeFormat = "h:mm aa";

        const dateA = parse(`${a.date} ${a.time}`, `${dateFormat} ${timeFormat}`, new Date());
        const dateB = parse(`${b.date} ${b.time}`, `${dateFormat} ${timeFormat}`, new Date());
        return dateA.getTime() - dateB.getTime();
    });
}

const All = ({userId} : { userId : string} ) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    
    const fetchExpenses = async() =>{
    
        const response = await axios.get('../api/expense', { 
            params:{
                id: userId
            }
        });
        setExpenses(sortExpenses(response.data.expenses));
        // console.log(response.data.expenses);
    }

    useEffect(() => {
        fetchExpenses();
    },[])

    const addExpense = (expense: Expense) => {
        setExpenses(prev => sortExpenses([...prev, expense]));
    };

    const updateExpense = (updatedExpense: Expense) => {
        setExpenses(prev =>
            sortExpenses(prev.map(exp => exp._id === updatedExpense._id ? updatedExpense : exp))
        );
    };

    const delExpense = (_id:string) => {
        setExpenses(prev => sortExpenses(prev.filter(exp => exp._id !== _id)));
    }


    return (
      <div className="pb-24 w-full bg-gray-200 flex flex-col items-center">
        <div className="w-3/4">
          <div className="mt-24 mb-7 flex lg:flex-row flex-col gap-4 justify-center items-center">
            <DashBoard userId={userId} expenses={expenses}/>  
            <Track userId={userId} expenses={expenses}/>
          </div>
        </div>
        <div className="mb-7 md:w-3/4 w-5/6">
            <ExpenseList userId={userId} expenses={expenses} onAddExpense={addExpense} onUpdateExpense={updateExpense} onDeleteExpense={delExpense}/>  
        </div>
        <div className="mb-7 md:w-2/3 w-3/4 flex lg:flex-row flex-col gap-7 justify-center items-center">
            <Balancetrack userId={userId} expenses={expenses}/>
            <IncExpTrack userId={userId} expenses={expenses}/>
        </div>
        <div className="mb-7 md:w-2/3 w-5/6">
            <TrackByCategory userId={userId} expenses={expenses}/>
        </div>
      </div>
  );
}
export default All
