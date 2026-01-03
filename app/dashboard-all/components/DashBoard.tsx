'use client'

import React, { useState } from "react";
import { Expense } from '../../page';
import Link from "next/link";
import Image from "next/image";
import { getDailySummary, getMonthlySummary, getWeeklySummary, getYearlySummary } from "./SummaryData";

type DashBoardProps = {
    expenses: Expense[];
};

const DashBoard= ({ expenses }: DashBoardProps) => {
    const [ option, setOption ] = useState< "Daily" | "Weekly" | "Monthly" | "Yearly" >("Daily");
    
    const dailySummary = getDailySummary(expenses);
    const weeklySummary = getWeeklySummary(expenses);
    const monthlySummary = getMonthlySummary(expenses);
    const yearlySummary = getYearlySummary(expenses);

    const formatCurrency = (amount: number) => {
        return (amount % 1 === 0
                ? new Intl.NumberFormat('en-IN').format(amount)
                : new Intl.NumberFormat('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(amount))
    };

    return (
        <div className="mt-24 mb-7 lg:w-1/2 w-5/6 md:h-[480px] h-5/6 bg-gray-700 flex flex-col justify-start rounded-lg shadow-lg">
            <div className="w-full py-2 px-5 flex flex-row justify-between border-b border-b-white">
                <div className="w-full p-2 pr-0 md:text-2xl text-md text-white">Dashboard</div>
                <div className="w-fit flex flex-col justify-center">
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
            <div className="w-full flex md:flex-row flex-col lg:h-auto h-11/12 md:justify-center justify-start py-4">
                <div className="md:w-1/4 w-full p-3 border-r border-r-white text-white font-light md:text-sm text-xs flex md:flex-col flex-row md:justify-center justify-start items-center gap-2">
                    <button onClick={() => {setOption("Daily")}} className={option === "Daily"?
                        "md:w-1/2 rounded-xl border border-white px-2 py-1 bg-gray-500"
                        : "md:w-1/2 rounded-xl border border-white px-2 py-1 hover:bg-gray-600"}>Daily</button>
                    <button onClick={() => {setOption("Weekly")}} className={option === "Weekly"?
                        "md:w-1/2 rounded-xl border border-white px-2 py-1 bg-gray-500"
                        : "md:w-1/2 rounded-xl border border-white px-2 py-1 hover:bg-gray-600"}>Weekly</button>
                    <button onClick={() => {setOption("Monthly")}} className={option === "Monthly"?
                        "md:w-1/2 rounded-xl border border-white px-2 py-1 bg-gray-500"
                        : "md:w-1/2 rounded-xl border border-white px-2 py-1 hover:bg-gray-600"}>Monthly</button>
                    <button onClick={() => {setOption("Yearly")}} className={option === "Yearly"?
                        "md:w-1/2 rounded-xl border border-white px-2 py-1 bg-gray-500"
                        : "md:w-1/2 rounded-xl border border-white px-2 py-1 hover:bg-gray-600"}>Yearly</button>
                </div>
                <div className="md:w-3/4 w-full px-4 pb-4 md:h-[385px] bg-gray-700 rounded-lg overflow-y-auto">
                {(option === "Daily")?(
                    Object.entries(dailySummary).map(([date,{income, expense}]) => 
                        <div key={date} className=" text-white flex flex-col justify-center">
                            <div className=" p-2 pr-0 text-md">{date}</div>
                            <div className="pb-4 flex flex-col gap-1 border-t border-t-white text-sm">
                                <div className="flex flex-row p-1 pr-0 bg-gray-600">
                                    <div className="w-3/5 text-white font-light">Income</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-green-600">{formatCurrency(income)} </div> 
                                </div>                   
                                <div className="flex flex-row p-1 pr-0 bg-gray-600">
                                    <div className="w-3/5 text-white font-light">Expense</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-red-600">{formatCurrency(expense)}</div>
                                </div>
                                <div className="flex flex-row p-1 pr-0 bg-gray-600 border-b border-b-white">
                                    <div className="w-3/5 text-white font-light ">Balance</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white">{formatCurrency(income-expense)}</div>
                                </div>
                            </div>
                        </div>)
                ):((option === "Weekly")?(
                    Object.entries(weeklySummary).map(([date,{income, expense}]) => 
                        <div key={date} className=" text-white flex flex-col justify-center">
                            <div className=" p-2 pr-0 text-md">{date}</div>
                            <div className="pb-4 flex flex-col gap-1 border-t border-t-white text-sm ">
                                <div className="flex flex-row p-1 pr-0 bg-gray-600">
                                    <div className="w-3/5 text-white font-light">Income</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-green-600">{formatCurrency(income)} </div> 
                                </div>                   
                                <div className="flex flex-row p-1 pr-0 bg-gray-600">
                                    <div className="w-3/5 text-white font-light">Expense</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-red-600">{formatCurrency(expense)}</div>
                                </div>
                                <div className="flex flex-row p-1 pr-0 bg-gray-600 border-b border-b-white">
                                    <div className="w-3/5 text-white font-light ">Balance</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white">{formatCurrency(income-expense)}</div>
                                </div>
                            </div>
                        </div>)
                ):((option === "Monthly")?(
                    Object.entries(monthlySummary).map(([date,{income, expense}]) => 
                        <div key={date} className=" text-white flex flex-col justify-center">
                            <div className=" p-2 pr-0 text-md">{date}</div>
                            <div className="pb-4 flex flex-col gap-1 border-t border-t-white text-sm ">
                                <div className="flex flex-row p-1 pr-0 bg-gray-600">
                                    <div className="w-3/5 text-white font-light">Income</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-green-600">{formatCurrency(income)} </div> 
                                </div>                   
                                <div className="flex flex-row p-1 pr-0 bg-gray-600">
                                    <div className="w-3/5 text-white font-light">Expense</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-red-600">{formatCurrency(expense)}</div>
                                </div>
                                <div className="flex flex-row p-1 pr-0 bg-gray-600 border-b border-b-white">
                                    <div className="w-3/5 text-white font-light ">Balance</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white">{formatCurrency(income-expense)}</div>
                                </div>
                            </div>
                        </div>)
                ):(
                    Object.entries(yearlySummary).map(([date,{income, expense}]) => 
                        <div key={date} className=" text-white flex flex-col justify-center">
                            <div className=" p-2 pr-0 text-md">{date}</div>
                            <div className="pb-4 flex flex-col gap-1 border-t border-t-white text-sm ">
                                <div className="flex flex-row p-1 pr-0 bg-gray-600">
                                    <div className="w-3/5 text-white font-light">Income</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-green-600">{formatCurrency(income)} </div> 
                                </div>                   
                                <div className="flex flex-row p-1 pr-0 bg-gray-600">
                                    <div className="w-3/5 text-white font-light">Expense</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white border-r-2 border-red-600">{formatCurrency(expense)}</div>
                                </div>
                                <div className="flex flex-row p-1 pr-0 bg-gray-600 border-b border-b-white">
                                    <div className="w-3/5 text-white font-light ">Balance</div>
                                    <div className="w-full text-sm pr-2 flex justify-end text-white">{formatCurrency(income-expense)}</div>
                                </div>
                            </div>
                        </div>)
                    )))}
                </div>
            </div>
        </div>
    )
}

export default DashBoard
