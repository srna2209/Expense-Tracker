import { useState } from "react";
import { Expense } from "../page";
import { getDailybyCategory, getExpensebyCategory, getIncomebyCategory, getMonthlybyCategory, getWeeklybyCategory, getYearlybyCategory } from "./CategoryData";
import { balance } from "./Balance";

type CategoryExpense = {
    category: string;
    amount: number;
    percentage: string;
}
const sortDesc = (categoryExpenses: CategoryExpense[]): CategoryExpense[] => {
    return [...categoryExpenses].sort((a,b) => {
        return (parseFloat(b.percentage) - parseFloat(a.percentage))
    });
}

export default function TrackByCategory({ userId, expenses }: {userId:string, expenses: Expense[]}){
    const [ option, setOption ] = useState<"Income" | "Expense">("Income");
    const [ filterOption, setFilterOption ] = useState<"All" | "Daily" | "Weekly" | "Monthly" | "Yearly">("All");

    const { totalIncome, totalExpenses, netBalance } = balance(expenses);
    const incomeByCategory = sortDesc(getIncomebyCategory(expenses));
    const expenseByCategory = sortDesc(getExpensebyCategory(expenses));

    const { dailyIncomeByCategory, dailyExpenseByCategory } = getDailybyCategory(expenses);
    const { weeklyIncomeByCategory, weeklyExpenseByCategory } = getWeeklybyCategory(expenses);
    const { monthlyIncomeByCategory, monthlyExpenseByCategory } = getMonthlybyCategory(expenses);
    const { yearlyIncomeByCategory, yearlyExpenseByCategory } = getYearlybyCategory(expenses);

    const formatCurrency = (amount: number) => {
        return (amount % 1 === 0
                ? new Intl.NumberFormat('en-IN').format(amount)
                : new Intl.NumberFormat('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(amount))
        };
    if(expenses.length == 0)
        return (
            <div className="bg-gray-700 rounded-lg shadow-lg flex flex-col items-center pb-5">
                <div className="w-full p-4 px-5 pb-2 pt-6 text-xl text-white">Track by Category</div>
                <div className="w-2/3 bg-white text-md font-thin text-gray-500 p-5 mt-4">No transactions yet to generate</div>
            </div>
    )
      
    return (
        <div className="bg-gray-700 rounded-lg shadow-lg">
            <div className="w-full p-4 px-5 pb-2 pt-6 text-xl text-white">Track by Category</div>
            <div className="w-full p-4 flex flex-row justify-center text-white text-sm font-thin gap-3">
                <button onClick={() => {setOption("Income")}} className={option === "Income"?
                    "rounded-xl border border-white px-5 py-1 bg-gray-500"
                    : "rounded-xl border border-white px-5 py-1 hover:bg-gray-600"}>Income</button>
                <button onClick={() => {setOption("Expense")}} className={option === "Expense"?
                    "rounded-xl border border-white px-5 py-1 bg-gray-500"
                    : "rounded-xl border border-white px-5 py-1 hover:bg-gray-600"}>Expense</button>
            </div>
            <div className="w-full p-4 flex flex-row justify-center text-white text-sm font-thin md:gap-3 gap-1">
                <button onClick={() => {setFilterOption("All")}} className={filterOption === "All"?
                "rounded-xl border border-white md:px-5 px-3 py-1 bg-gray-500"
                : "rounded-xl border border-white md:px-5 px-3 py-1 hover:bg-gray-600"}>All</button>
                <button onClick={() => {setFilterOption("Daily")}} className={filterOption === "Daily"?
                    "rounded-xl border border-white md:px-5 px-3 py-1 bg-gray-500"
                    : "rounded-xl border border-white md:px-5 px-3 py-1 hover:bg-gray-600"}>Daily</button>
                <button onClick={() => {setFilterOption("Weekly")}} className={filterOption === "Weekly"?
                    "rounded-xl border border-white md:px-5 px-3 py-1 bg-gray-500"
                    : "rounded-xl border border-white md:px-5 px-3 py-1 hover:bg-gray-600"}>Weekly</button>
                <button onClick={() => {setFilterOption("Monthly")}} className={filterOption === "Monthly"?
                    "rounded-xl border border-white md:px-5 px-3 py-1 bg-gray-500"
                    : "rounded-xl border border-white md:px-5 px-3 py-1 hover:bg-gray-600"}>Monthly</button>
                <button onClick={() => {setFilterOption("Yearly")}} className={filterOption === "Yearly"?
                "rounded-xl border border-white md:px-5 px-3 py-1 bg-gray-500"
                : "rounded-xl border border-white md:px-5 px-3 py-1 hover:bg-gray-600"}>Yearly</button>
            </div>
            <div className="w-full flex flex-col items-center text-white pb-3">
                {(option === "Income")?(
                    <div className="font-thin text-sm">Total : {formatCurrency(totalIncome)}</div>
                ):(
                    <div className="font-thin text-sm">Total : {formatCurrency(totalExpenses)}</div>
                )}
            </div>
            <div className="w-full flex flex-col items-center">
                <div className="lg:w-3/4 md:w-3/4 w-11/12 text-sm font-normal pb-8">
                    <div className="w-full mb-3 bg-gray-600 text-white flex flex-row justify-center">
                        <div className="w-2/4 pl-2 py-2 border border-gray-300">Category</div>
                        <div className="w-1/4 pl-2 py-2 border border-gray-300">Amount</div>
                        <div className="w-1/4 pl-2 py-2 border border-gray-300">Percentage</div>
                    </div>
                    <div className="w-full flex flex-col items-center max-h-[380px] overflow-y-auto">
                    {(option === "Income")?
                        ((filterOption === "Daily")?(
                            Object.entries(dailyIncomeByCategory).map(([date, data])=>
                            <div key={date} className="w-full">
                                <div className="bg-gray-100 p-2 font-thin">{date}</div>
                                {sortDesc(data).map(({category, amount, percentage}) => 
                                <div key={category}className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>)}
                            </div>)
                        ):((filterOption === "Weekly")?(
                            Object.entries(weeklyIncomeByCategory).map(([date, data])=>
                            <div key={date} className="w-full">
                                <div className="bg-gray-100 p-2 font-thin">{date}</div>
                                {sortDesc(data).map(({category, amount, percentage}) => 
                                <div key={category}className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>)}
                            </div>)
                        ):((filterOption === "Monthly")?(
                            Object.entries(monthlyIncomeByCategory).map(([date, data])=>
                            <div key={date} className="w-full">
                                <div className="bg-gray-100 p-2 font-thin">{date}</div>
                                {sortDesc(data).map(({category, amount, percentage}) => 
                                <div key={category}className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>)}
                            </div>)
                        ):((filterOption === "Yearly")?(
                            Object.entries(yearlyIncomeByCategory).map(([date, data])=>
                            <div key={date} className="w-full">
                                <div className="bg-gray-100 p-2 font-thin">{date}</div>
                                {sortDesc(data).map(({category, amount, percentage}) => 
                                <div key={category}className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>)}
                            </div>)
                        ):(
                            incomeByCategory.map(({category, amount, percentage})=>
                                <div key={category} className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>
                            )
                        ))))
                    ):((filterOption === "Daily")?(
                            Object.entries(dailyExpenseByCategory).map(([date, data])=>
                            <div key={date} className="w-full">
                                <div className="bg-gray-100 p-2 font-thin">{date}</div>
                                {sortDesc(data).map(({category, amount, percentage}) => 
                                <div key={category}className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>)}
                            </div>)
                        ):((filterOption === "Weekly")?(
                            Object.entries(weeklyExpenseByCategory).map(([date, data])=>
                            <div key={date} className="w-full">
                                <div className="bg-gray-100 p-2 font-thin">{date}</div>
                                {sortDesc(data).map(({category, amount, percentage}) => 
                                <div key={category}className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>)}
                            </div>)
                        ):((filterOption === "Monthly")?(
                            Object.entries(monthlyExpenseByCategory).map(([date, data])=>
                            <div key={date} className="w-full">
                                <div className="bg-gray-100 p-2 font-thin">{date}</div>
                                {sortDesc(data).map(({category, amount, percentage}) => 
                                <div key={category}className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>)}
                            </div>)
                        ):((filterOption === "Yearly")?(
                            Object.entries(yearlyExpenseByCategory).map(([date, data])=>
                            <div key={date} className="w-full">
                                <div className="bg-gray-100 p-2 font-thin">{date}</div>
                                {sortDesc(data).map(({category, amount, percentage}) => 
                                <div key={category}className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                    <div className="w-2/4 pl-2 py-2">{category}</div>
                                    <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                    <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                                </div>)}
                            </div>)
                        ):(
                            expenseByCategory.map(({category, amount, percentage})=>
                            <div key={category} className="w-full py-2 bg-white border-b border-b-gray-300 flex flex-row justify-center">
                                <div className="w-2/4 pl-2 py-2">{category}</div>
                                <div className="w-1/4 pl-4 py-2 font-thin">{formatCurrency(amount)}</div>
                                <div className="w-1/4 pl-5 py-2">{`${percentage}%`}</div>
                            </div>
                        )
                        ))))
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}