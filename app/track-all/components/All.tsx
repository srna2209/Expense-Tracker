'use client'

import React, {useState, useEffect} from "react";
import Track from "./Track";
import { Expense } from "../../page";
import { parse } from 'date-fns'; 
import axios from "axios";

const sortExpenses = (expenses: Expense[]): Expense[] => {
    return [...expenses].sort((a, b) => {
        const dateFormat = "dd MMM yyyy";
        const timeFormat = "h:mm aa";

        const dateA = parse(`${a.date} ${a.time}`, `${dateFormat} ${timeFormat}`, new Date());
        const dateB = parse(`${b.date} ${b.time}`, `${dateFormat} ${timeFormat}`, new Date());
        return dateA.getTime() - dateB.getTime();
    });
}

const All = ({ userId } : {userId: string}) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const fetchExpenses = async() =>{
        const response = await axios.get('../api/expense', { 
            params:{
                id: userId
            }
        });
        setExpenses(response.data.expenses);
        // console.log(response.data.expenses);
    }

    useEffect(() => {
        fetchExpenses();
    },[])

    return (
      <div className="w-full bg-gray-200 flex flex-col items-center min-h-screen">
        <Track expenses={expenses}/>
      </div>
  );
}
export default All
