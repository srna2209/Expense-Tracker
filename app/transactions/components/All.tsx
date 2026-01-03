'use client'

import React, {useEffect, useState} from "react";
import ExpenseList from "./ExpenseList";
import { Expense } from "../../page";
import { parse } from 'date-fns'; 
import axios from "axios";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import Link from "next/link";
import Image from "next/image";

const sortExpenses = (expenses: Expense[]): Expense[] => {
    return [...expenses].sort((a, b) => {
        const dateFormat = "dd MMM yyyy";
        const timeFormat = "h:mm aa";

        const dateA = parse(`${a.date} ${a.time}`, `${dateFormat} ${timeFormat}`, new Date());
        const dateB = parse(`${b.date} ${b.time}`, `${dateFormat} ${timeFormat}`, new Date());
        return dateA.getTime() - dateB.getTime();
    });
}

const All = ({userId}:{userId : string}) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    const fetchExpenses = async() =>{
    
        const response = await axios.get('../api/expense', { 
            params:{
                id: userId
            }
        });
        setExpenses(sortExpenses(response.data.expenses));
        console.log(response.data.expenses);
    }

    useEffect(() => {
        fetchExpenses();
    },[])

    const addExpense = (expense: Expense) => {
        // const newExpense = {
        // _id: crypto.randomUUID(),
        // ...expense,
        // };
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

    const filteredExpenses = expenses.filter(exp =>
        exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.amount.toString().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="w-full bg-gray-200 flex flex-col items-center min-h-screen">
            <div className="mt-24 mb-7 md:w-3/4 w-5/6 bg-gray-700 rounded-lg shadow-lg min-h-auto">
                <div className="flex flex-row justify-between w-full">
                    <h2 className="p-4 px-5 md:text-2xl text-xl text-white md:w-4/6">Transactions</h2>
                    <div className="flex flex-col justify-center md:w-1/6 w-2/6">
                        <input 
                        type="text"
                        placeholder="Search…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-2 px-3 bg-gray-600 text-white rounded-lg md:text-xs text-[10px] focus:outline-none"
                    />
                    </div>
                    <div className="md:px-5 px-2 flex flex-col justify-center items-end md:1/6">
                        <Link href='/'>
                            <Image
                            src="/exit_fullscreen.svg"
                            alt="Exit"
                            width={32} 
                            height={32}
                            style={{ objectFit: 'contain' }}
                            className="p-2 h-8 w-8 bg-gray-700 rounded-full hover:bg-gray-600 focus: outline-none transition-transform duration-200 ease-out active:scale-95"
                            />
                        </Link>
                    </div>
                </div>
                <ExpenseList userId={userId} expenses={filteredExpenses} onAddExpense={addExpense} onUpdateExpense={updateExpense} onDeleteExpense={delExpense}/>  
            </div>
        </div>
  );
}
export default All
