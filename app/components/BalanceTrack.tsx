import { Expense } from "../page";
import BalanceLineChart from "./BalanceLinechart";

type BalanceProps = {
    userId: string;
    expenses: Expense[];
}
export function Balancetrack({ userId, expenses }:BalanceProps){
    return <>
        <div className="md:w-1/2 w-full bg-gray-700 rounded-lg shadow-lg">
            <div className="flex flex-row justify-between">
                <div className="p-4 px-5 pb-2 pt-6 text-xl text-white">Balance</div>
                <div className="p-4 pr-7 pb-2 pt-8 text-xs font-extralight text-white"> Last 7 days</div>
            </div>
            <BalanceLineChart userId={userId} expenses={expenses}/>
        </div>
    </>
}