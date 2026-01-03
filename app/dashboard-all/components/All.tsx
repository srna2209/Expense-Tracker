"use client"

import { useCallback, useEffect, useState } from "react";
import { Expense } from "../../page";
import axios from "axios";
import DashBoard from "./DashBoard";
import { parse } from "date-fns";

const sortExpenses = (expenses: Expense[]): Expense[] => {
    return [...expenses].sort((a, b) => {
        const dateFormat = "dd MMM yyyy";
        const timeFormat = "h:mm aa";

        const dateA = parse(`${a.date} ${a.time}`, `${dateFormat} ${timeFormat}`, new Date());
        const dateB = parse(`${b.date} ${b.time}`, `${dateFormat} ${timeFormat}`, new Date());
        return dateA.getTime() - dateB.getTime();
    });
}


export default function All({ userId } : {userId: string}) {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const fetchExpenses = useCallback(async() =>{
        const response = await axios.get('../api/expense', { 
            params:{
                id: userId
            }
        });
        setExpenses(sortExpenses(response.data.expenses));
        // console.log(response.data.expenses);
    },[userId]);

    useEffect(() => {
        fetchExpenses();
    },[fetchExpenses]);

    return (
      <div className="w-full pb-10 bg-gray-200 flex flex-col items-center h-screen">
        <DashBoard expenses={expenses}/>
      </div>
  );
}