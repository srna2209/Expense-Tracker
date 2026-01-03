'use client'
import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse,format } from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import { Expense } from "../../page";
import axios from "axios";

type ItemsProps = {
  userId: string;
  expenses: Expense[]; 
  onUpdate: (expense: Expense) => void;
  onDelete: (_id:string)=>void; 
  runningBalance: Number;
}

const Items: React.FC<ItemsProps> = ({ userId, expenses, onUpdate, onDelete, runningBalance }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Partial<Omit<Expense, 'date' | 'time'> & { date: Date | string; time: Date | string }>>({});
    const [showFullNameId, setShowFullNameId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [error,setError] = useState(false);
    let currentRunningBalance = 0;
    
    const formatCurrency = (amount: number) => {
        return (amount % 1 === 0
                ? new Intl.NumberFormat('en-IN').format(amount)
                : new Intl.NumberFormat('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(amount))
        };

    const handleDelete = async(deleteId : string) => {
        const response = await axios.delete('../api/expense', {
        params : {
        userId: userId,
        id: deleteId,
        }});
        if(response.data.success){
            onDelete(deleteId);
            setShowConfirm(false);
            setDeleteId(null);  
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 2000);

        }
        else
        {
            setError(true);

            setTimeout(() => {
                setError(false);
            }, 2000);
        }


    }
    
    const handleEdit = (expense: Expense) => {
        setEditingId(expense._id);
        setEditValues({
        type: expense.type,
        name: expense.name,
        category: expense.category,
        amount: expense.amount, 
        date: parse(expense.date, 'dd MMM yyyy', new Date()),
        time: parse(expense.time, 'h:mm aa', new Date()),
        });
    };

    const handleSave = async (_id: string, userId: string, type: string) => {
        const updateData = {
            type,
            name: editValues.name!,
            category: editValues.category!,
            amount: editValues.amount!,     
            date: format(editValues.date as Date, 'dd MMM yyyy'), 
            time: format (editValues.time as Date, 'h:mm aa')  
        }
        // console.log("update data: ", updateData);
        const response = await axios.put('../api/expense', updateData, {params : {
            userId: userId,
            id: _id,
        }});
        // console.log(response.data.expense);
        if(response.data.success)
        {
        onUpdate(response.data.expense);
        }
        setEditingId(null);
        setEditValues({});
    };
    


    return (
        <>
            <div className="min-h-auto">
                <ul className="p-4 px-5 rounded-b-md">
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-xl">
                            <div className="w-full flex flex-row gap-1">
                                <div className="py-3 flex flex-row gap-1 w-5/6">
                                <p className="w-2/6 px-3 py-1 bg-gray-600 text-white rounded-md ">Name</p>
                                <p className="w-1/6 px-3 py-1 bg-gray-600 text-white rounded-md ">Category</p>
                                <p className="w-1/6 px-3 py-1 bg-gray-600 text-white rounded-md ">Amount</p>
                                <p className="w-2/6 px-3 py-1 bg-gray-600 text-white rounded-md ">Date</p>
                                </div>
                                <div className="py-3 flex flex-row gap-1 w-1/6">
                                <p className="w-full px-3 py-1 bg-gray-600 text-white rounded-md ">Options</p>
                                </div>
                            </div>
                    {expenses.length === 0 ? (
                        <div className="w-full p-2 py-5 font-light text-center bg-gray-50"> 
                            No transaction
                        </div>
                        ) : (
                        <div>
                        {expenses.map((exp) => {
                        if (exp.type === 'Income') {
                            currentRunningBalance += exp.amount
                        } else if(exp.type === 'Expense') {
                            currentRunningBalance -= exp.amount
                        }
                        
                        return (
                            <li key={exp._id}>
                            {editingId === exp._id ? (
                            <div className="shadow-lg">
                                <div className="p-2 flex flex-row gap-2 w-full bg-gray-50">
                                <div className="flex flex-row items-start gap-2 w-5/6">
                                    <input
                                    type="text"
                                    value={editValues.name}
                                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                                    className="rounded-md px-3 py-1 w-2/6 focus:outline-none"
                                    />
                                    <input
                                    type="text"
                                    value={editValues.category}
                                    onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                                    className="rounded-md font-light px-3 py-1 w-1/6 focus:outline-none"
                                    />
                                    <p className="flex flex-row rounded-md px-3 py-1 w-1/6">
                                    <input
                                    type="number"
                                    value={editValues.amount?.toString()}
                                    onChange={(e) => setEditValues({ ...editValues, amount: parseFloat(e.target.value) })}
                                    className="focus:outline-none w-full"
                                    />
                                    </p>
                                    <div className="flex flex-row font-light text-sm rounded-md px-3 py-1 w-2/6">
                                    <div className="w-1/2">
                                        <DatePicker
                                        selected={editValues.date ? (editValues.date as Date) : null}
                                        onChange={(date) => { if (date) { setEditValues({ ...editValues, date });} } }
                                        dateFormat="dd MMM yyyy"
                                        placeholderText="Date"
                                        className="focus:outline-none w-full"
                                        wrapperClassName="w-full"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <DatePicker
                                        selected={editValues.time ? (editValues.time as Date) : null}
                                        onChange={(time) => { if (time) { setEditValues({ ...editValues, time });} } }
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                        placeholderText="Time"
                                        className="focus:outline-none w-full"
                                        wrapperClassName="w-full"
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className=" h-12 flex justify-center items-center gap-2 w-1/6">
                                    <button onClick={() => handleSave(exp._id, exp.userId, exp.type)} 
                                        className="w-16 h-8 px-2 py-1 bg-gray-700 text-sm text-white rounded-md hover:bg-gray-600 transition-transform duration-200 ease-out active:scale-95">
                                            Save
                                    </button>
                                    <button onClick={() => setEditingId(null)} 
                                        className="w-16 h-8 px-2 py-1 bg-gray-700 text-sm text-white rounded-md hover:bg-gray-600 transition-transform duration-200 ease-out active:scale-95">
                                            Cancel
                                    </button>
                                </div>
                                </div>
                                </div>
                            ):(
                            <div className="shadow-lg">
                                <div className="p-2 flex flex-row gap-2 w-full bg-gray-50" >
                                <div className="flex flex-row gap-2 w-5/6">
                                    <p onClick={() => setShowFullNameId(prev => prev === exp._id ? null : exp._id)}
                                className="rounded-md px-3 py-1 w-2/6 break-words whitespace-normal overflow-hidden text-ellipsis">
                                    {showFullNameId === exp._id
                                        ? exp.name 
                                        : exp.name.length > 20 ? exp.name.slice(0, 20) + "..." 
                                        : exp.name}
                                    </p>
                                    <p onClick={() => handleEdit(exp)} className="rounded-md font-light px-3 py-1 w-1/6">{exp.category}</p>
                                    <p
                                    onClick={() => handleEdit(exp)}
                                    className={`rounded-md px-3 py-1 w-1/6 break-words ${
                                        exp.type === 'Income' ? 'text-green-600'
                                        : exp.type === 'Expense' ? 'text-red-600'
                                        : 'text-blue-600'
                                    }`}
                                    >
                                    {Number(exp.amount) % 1 === 0
                                        ? new Intl.NumberFormat('en-IN').format(Number(exp.amount))
                                        : new Intl.NumberFormat('en-IN', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(Number(exp.amount))}
                                    </p>
                                    <div onClick={() => handleEdit(exp)} className="flex flex-row rounded-md font-light text-sm px-3 py-1 w-2/6">
                                    <p className="w-1/2">{exp.date}</p>
                                    <p className="w-1/2">{exp.time}</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-2 h-12 w-1/6">
                                    <button onClick={() => handleEdit(exp)} 
                                        className="w-16 h-8 bg-gray-700 text-sm text-white rounded-md hover:bg-gray-600 transition-transform duration-200 ease-out active:scale-95">
                                            Edit
                                    </button>
                                    <button onClick = {() => 
                                    {
                                        setDeleteId(exp._id);
                                        setShowConfirm(true);
                                    }
                                    } className="h-8 w-8 bg-gray-700 rounded-md hover:bg-red-800 focus: outline-none transition-transform duration-200 ease-out active:scale-95">
                                    <Image
                                    className="p-2"
                                    src="/delete.svg"
                                    alt="Delete"
                                    width={32} 
                                    height={32}
                                    style={{ objectFit: 'contain' }}
                                    />
                                    </button>
                                    
                                </div>
                                </div>
                            </div>
                            )}
                            <div className="pl-3 bg-gray-50 text-gray-500 text-sm font-thin border-b border-gray-400">
                                Balance: {formatCurrency(currentRunningBalance)}
                            </div>
                            </li> 
                            )        
                            })}
                            {showConfirm && 
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
                                {/* error here  */}
                                <div className=" bg-gray-100 w-72 rounded-md p-5">
                                    <div className="font-light">
                                    Are you sure to delete?
                                    </div>
                                    <div className="flex flex-row justify-end gap-5">
                                    <button onClick = {() => {
                                        setShowConfirm(false);
                                        setDeleteId(null);
                                        } } className="text-gray-800 transition-transform duration-200 ease-out active:scale-95">
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => {
                                        if(deleteId != null)
                                        {
                                            handleDelete(deleteId);
                                        }            
                                    }} 
                                    className="text-gray-800 transition-transform duration-200 ease-out active:scale-95">
                                        Delete
                                    </button>
                                </div>
                                </div>
                                </div>
                            }
                        </div>)}
                        </div>
                    </div>
                </ul>
            </div>
            {showToast && 
            (
                <div className="fixed top-5 right-5 flex flex-row justify-start border border-gray-500 bg-white text-gray-500 text-sm p-3 rounded-sm shadow-lg z-50 w-64">
                    <Image
                    src="/checkCircle.svg"
                    alt=""
                    width={32} 
                    height={32}
                    style={{ objectFit: 'contain' }}
                    className="p-1 h-9 w-9"
                    />
                    <div className="flex items-center">Transaction deleted successfully!</div>
                </div>
            )}
            {error && 
            (
                <div className="fixed top-5 right-5 flex flex-row justify-start border border-gray-500 bg-white text-gray-500 text-sm p-3 rounded-sm shadow-lg z-50 w-64">
                    <Image
                    src="/error.svg"
                    alt=""
                    width={32} 
                    height={32}
                    style={{ objectFit: 'contain' }}
                    className="p-1 h-9 w-9"
                    />
                    <div className="flex items-center">Error</div>
                </div>
            )}
        </>
    );
};

export default Items;
