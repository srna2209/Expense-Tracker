'use client'
import React, { useState } from "react";
import Add from "../../components/Add";
import Items from "./Items";
import { Expense } from "../../page";

type ExpenseListProps = {
    userId: string;
    expenses: Expense[];
    onAddExpense: (expense: Expense) => void;
    onUpdateExpense: (expense: Expense) => void;
    onDeleteExpense: (_id: string) => void;
};


const ExpenseList: React.FC<ExpenseListProps> = ({userId, expenses, onAddExpense, onUpdateExpense, onDeleteExpense})=> {

    return (
        <>
            <Add userId={userId} onAddExpense={onAddExpense} />
            <Items
                userId={userId}
                expenses={expenses}
                onUpdate={onUpdateExpense}
                onDelete={onDeleteExpense}
            />
        </>
    )
}

export default ExpenseList;
