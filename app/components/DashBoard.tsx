'use client'

import React from "react";
import { Expense } from '../page';
import { balance } from "./Balance"; 
import { getMonthlySummary } from "./MonthlyTrack";
import Link from "next/link";
import Image from "next/image";

type DashBoardProps = {
    userId: string;
    expenses: Expense[];
};

const DashBoard: React.FC<DashBoardProps> = ({ expenses }) => {
    const { totalIncome, totalExpenses, netBalance } = balance(expenses);

    const formatCurrency = (amount: number) => {
        return (amount % 1 === 0
                ? new Intl.NumberFormat('en-IN').format(amount)
                : new Intl.NumberFormat('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(amount))
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const summary = getMonthlySummary(expenses);
    const now = new Date();
    const monthName = monthNames[now.getMonth()]; 
    const year = now.getFullYear();

    const currentMonthKey = `${monthName} ${year}`;
    if (!summary[currentMonthKey]) {
        summary[currentMonthKey] = { income: 0, expense: 0 };
    }

    const currentSummary = summary[currentMonthKey];
    
    return (
        <div className="mt-4 mb-4 lg:h-54 lg:w-7/12 w-full bg-gray-200 flex md:flex-row flex-col gap-4">
            <div className="lg:w-3/5 md:1/2 w-full p-6 py-7 bg-gray-700 rounded-lg shadow-lg">
                <div className="flex flex-row p-1 pt-3 pr-0 bg-gray-600 border-t-2 border-gray-50">
                    <div className="w-3/5 text-white text-lg p-1 font-light">Income</div>
                    <div className="w-full p-1 pr-2 flex justify-end text-white border-r-2 border-green-600">{formatCurrency(totalIncome)}</div>
                </div>
                <div className="flex flex-row p-1 pr-0 pb-3 bg-gray-600 ">
                    <div className="w-3/5 text-white text-lg font-light p-1">Expense</div>
                    <div className="w-full flex justify-end p-1 pr-2 text-white border-r-2 border-red-600">{formatCurrency(totalExpenses)}</div>
                </div>
                <div className="mt-2 flex flex-row p-1 pb-2 bg-gray-600 border-t-2 border-gray-50">
                    <div className="w-3/5 text-white text-lg font-light p-1">Balance</div>
                    <div className="w-full p-1 flex justify-end text-white">{formatCurrency(netBalance)}</div>
                </div>
            </div>
            <div className="lg:w-3/5 md:1/2 w-full p-4 bg-gray-700 rounded-lg shadow-lg">
                <div className=" text-white flex flex-col justify-center border-b border-b-white">
                    <div className="w-full flex flex-row justify-between">
                        <div className=" p-2 pr-0 pb-4 text-lg">This month</div>
                        <div className="w-fit flex flex-col">
                            <Link href='/dashboard-all'>
                                <Image
                                src="/fullscreen.svg"
                                alt="Fullscreen"
                                width={32} 
                                height={32}
                                style={{ objectFit: 'contain' }}
                                className="p-2 h-8 w-8 bg-gray-700 rounded-full hover:bg-gray-600 focus: outline-none transition-transform duration-200 ease-out active:scale-95"
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-t-white">
                        <div className="flex flex-row p-2 pr-0 bg-gray-600">
                            <div className="w-3/5 text-white text-md font-light">Income</div>
                            <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-green-600">{formatCurrency(currentSummary.income)} </div> 
                        </div>                   
                        <div className="flex flex-row p-2 pr-0 bg-gray-600">
                            <div className="w-3/5 text-white text-md font-light">Expense</div>
                            <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-red-600">{formatCurrency(currentSummary.expense)}</div>
                        </div>
                        <div className="flex flex-row p-2 pr-0 bg-gray-600">
                            <div className="w-3/5 text-white text-md font-light ">Balance</div>
                            <div className="w-full text-sm pr-2 flex justify-end text-white">{formatCurrency(currentSummary.income - currentSummary.expense)}</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default DashBoard
