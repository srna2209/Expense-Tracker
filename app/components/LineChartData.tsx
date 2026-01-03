import { Expense } from "../page";
import { subDays,format,parse } from 'date-fns';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

type DailyBalanceSummary = {
  [day: string]: { balance: number };
};

type DailyExpenseSummary = {
  [day: string]: { income: number, expense: number };
};

export function getDailyBalance ( expenses: Expense[]) {
    
    const summary: DailyBalanceSummary = {};

    Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const key = format(date, "dd MMM yyyy");

      summary[key] = { balance: 0 };
    });

    expenses.forEach(exp => {
      const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
      
      const key = format(dateObj, "dd MMM yyy");
  
      if(!summary[key]) return;
  

      if (exp.type === "Income") summary[key].balance += exp.amount;
      else if (exp.type === "Expense") summary[key].balance -= exp.amount;

    });
  
    return summary;
}

export function balanceData ( expenses : Expense[]) {
    const sevenDaysBalance = getDailyBalance(expenses);

    let runningBalance = 0;

    return {
        labels: (Object.keys(sevenDaysBalance).map((key) => 
          format(parse(key, "dd MMM yyyy", new Date()), "dd MMM"))),
        datasets: [
        {
            label: "Balance",
            data: (Object.values(sevenDaysBalance).map(({ balance }) => {
                runningBalance += balance;
            return runningBalance;
            })),
            borderColor: "#4B5563",
            backgroundColor: "rgba(37, 99, 235, 0.2)",
            tension: 0, 
            pointRadius: 2,
        },
    ],
  };
}

export function getDailyExpense ( expenses: Expense[]) {
    
    const summary: DailyExpenseSummary = {};

    Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const key = format(date, "dd MMM yyyy");

      summary[key] = { income: 0, expense: 0 };
    });

  
    expenses.forEach(exp => {
      const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
  
      const key = format(dateObj, "dd MMM yyyy");
  
      if (!summary[key]) return;
  
      if (exp.type === "Income") summary[key].income += exp.amount;
      else if (exp.type === "Expense") summary[key].expense -= exp.amount;
    });
  
    return summary;
}

export function expenseData ( expenses : Expense[]) {
    const sevenDaysExpense = getDailyExpense(expenses);
    
    return {
        labels: (Object.keys(sevenDaysExpense).map((key) =>
          format(parse(key, "dd MMM yyyy", new Date()), "dd MMM")
        )),
        datasets: [
        {
            label: "Income",
            data: (Object.values(sevenDaysExpense).map(({ income }) => {
              return income;
            })),
            borderColor: "#16a34a",
            // backgroundColor: "rgba(37, 99, 235, 0.2)",
            tension: 0,      
            pointRadius: 2,
        },

        {
            label: "Expense",
            data: (Object.values(sevenDaysExpense).map(({ expense })) => {
              return expense;
            })).slice(-7),
            borderColor: "#dc2626",
            // backgroundColor: "rgba(37, 99, 235, 0.2)",
            tension: 0,     
            pointRadius: 2,
        },
    ],
  };

}


