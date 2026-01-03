'use client'

import React, {useState, useEffect} from "react";
import PieChart from "./Piechart";
import { Expense } from '../page';
import { getMonthlySummary } from "./MonthlyTrack";
import Link from "next/link";
import Image from "next/image";

type TrackProps = {
    userId: string;
    expenses: Expense[];
};


const Track: React.FC<TrackProps> = ({expenses}) => {
    const summary = getMonthlySummary(expenses);
    const mainMonths = Object.keys(summary);
    const months = [...mainMonths].reverse();
    const [selectedMonth, setSelectedMonth] = useState<string>(months[0] || "");

    useEffect(() => {
        if (months.length > 0 && (!selectedMonth || !summary[selectedMonth])) {
            setSelectedMonth(months[0]);
        }
    }, [months, selectedMonth, summary]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const selectedData = summary[selectedMonth];
    if (!selectedMonth || !selectedData) {
        return (
            <div className="mt-4 mb-4 min-h-54 lg:w-5/12 md:w-3/4 w-full bg-gray-700 rounded-lg flex flex-row justify-center items-center shadow-lg">
                <div className="text-white flex justify-center items-center text-center font-thin">
                    No transactions recorded yet to generate a track.
                </div>
            </div>
        );
    } 

    const chartData = {
        labels: ["Income","Expense"],
        values: [selectedData.income, selectedData.expense]
    }

    return (
        <div className="mt-4 mb-4 sm:h-54 lg:w-5/12 md:w-3/4 w-full p-5 pt-7 bg-gray-700 rounded-lg flex sm:flex-row flex-col justify-around shadow-lg">
            <div className="py-3 sm:w-7/12 w-full bg-gray-600 flex flex-col justify-center">
                <div className="flex flex-row justify-between">
                    <select
                    value={selectedMonth}
                    onChange={handleChange}
                    className="ml-2 mb-4 bg-gray-600 text-md text-white p-2 pt-4 pl-1 focus:outline-none"
                    >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                        ))}
                    </select>
                    <div className="mr-2 w-fit flex flex-col">
                        <Link href='/track-all'>
                            <Image
                            src="/fullscreen.svg"
                            alt="Fullscreen"
                            width={32} 
                            height={32}
                            style={{ objectFit: 'contain' }}
                            className="p-2 h-8 w-8 bg-gray-600 rounded-full hover:bg-gray-700 focus: outline-none transition-transform duration-200 ease-out active:scale-95"
                            />
                        </Link>
                    </div>
                </div>
                <div className="p-4 text-white text-sm font-thin border-l-2 border-l-gray-50">
                    Income: {selectedData.income} <br/> Expense: {selectedData.expense}
                </div>
            </div>
            <div className="w-full p-14 py-8 sm:w-5/12 sm:p-2 sm:-mr-4 flex flex-col justify-center bg-gray-700">
                <PieChart data={chartData} />
            </div>
        </div>
    )
}
export default Track