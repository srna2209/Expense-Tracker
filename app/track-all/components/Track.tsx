'use client'

import React from "react";
import PieChart from "@/app/components/Piechart";
import { Expense } from '@/app/page';
import { getMonthlySummary } from "@/app/components/MonthlyTrack";
import Link from "next/link";
import Image from "next/image";

type TrackProps = {
  expenses: Expense[];
};


const Track: React.FC<TrackProps> = ({expenses}) => {
    const summary = getMonthlySummary(expenses);
    const months = Object.keys(summary);

    return (
        <div className="relative mt-24 mb-7 md:w-3/4 w-5/6 py-14 lg:px-10 px-5 bg-gray-700 rounded-lg flex flex-col justify-center items-center shadow-lg min-h-auto">
            <div className="absolute top-3 right-5 w-fit flex flex-col">
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
            {months.map((month) => {
                const monthData = summary[month]
                return (
                    <div key={month} className="w-full flex flex-row justify-around bg-white">
                        <div className="w-3/5 flex flex-col justify-evenly">  
                            <div className="h-1/2 p-2 py-4 md:text-[16px] text-sm"> {month} </div>
                            <div className="h-3/4 p-3 text-gray-500 text-sm font-thin border-t border-t-gray-300 ">
                                Income: {monthData.income} <br/> Expense: {monthData.expense} <br/> <span className="font-normal">Balance: {monthData.income - monthData.expense}</span>
                            </div>
                        </div>
                        <div className="md:w-1/5 lg:p-5 sm:1/3 w-1/2 p-2">
                            <PieChart data={{
                                labels: ["Income","Expense"],
                                values: [monthData.income, monthData.expense]}}
                            />
                        </div>                    
                    </div>
                )}
            )}
        </div>
    )
}
export default Track