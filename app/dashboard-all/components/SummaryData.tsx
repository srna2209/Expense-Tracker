import { Expense } from "@/app/page";
import { endOfWeek, format, parse, startOfWeek} from "date-fns";

type Summary = {
    [date: string]: { income: number, expense: number };
}
export function getDailySummary ( expenses: Expense[]) {
    
    const summary: Summary = {};
  
    expenses.forEach(exp => {
      const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
      const day = dateObj.getDate();
      const month = format(dateObj,"MMM");
      const key = format(dateObj, "dd MMM yyyy");
  
      if (!summary[key]) summary[key] = { income: 0, expense: 0 };
  
      if (exp.type === "Income") summary[key].income += exp.amount;
      else if (exp.type === "Expense") summary[key].expense -= exp.amount;
    });
  
    return summary;
}

export function getWeeklySummary ( expenses: Expense[]) {
    
    const summary: Summary = {};
  
    expenses.forEach(exp => {
      const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
      const weekStart = startOfWeek(dateObj, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(dateObj, { weekStartsOn: 1 });
      const key = `${format(weekStart, "dd MMM")} - ${format(weekEnd,"dd MMM")}`;

      if (!summary[key]) summary[key] = { income: 0, expense: 0 };
  
      if (exp.type === "Income") summary[key].income += exp.amount;
      else if (exp.type === "Expense") summary[key].expense -= exp.amount;
    });
  
    return summary;
}

export function getMonthlySummary ( expenses: Expense[]) {
    
    const summary: Summary = {};
  
    expenses.forEach(exp => {
      const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
      const month = format(dateObj,"MMM");
      const year = dateObj.getFullYear();
      const key = `${month} ${year}`;
  
      if (!summary[key]) summary[key] = { income: 0, expense: 0 };
  
      if (exp.type === "Income") summary[key].income += exp.amount;
      else if (exp.type === "Expense") summary[key].expense -= exp.amount;
    });
  
    return summary;
}

export function getYearlySummary ( expenses: Expense[]) {
    
    const summary: Summary = {};
  
    expenses.forEach(exp => {
      const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
      const year = dateObj.getFullYear();
      const key = `${year}`;
  
      if (!summary[key]) summary[key] = { income: 0, expense: 0 };
  
      if (exp.type === "Income") summary[key].income += exp.amount;
      else if (exp.type === "Expense") summary[key].expense -= exp.amount;
    });
  
    return summary;
}


