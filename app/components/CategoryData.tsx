import { Expense } from "../page";
import { balance } from "./Balance";
import { parse,format, startOfWeek, endOfWeek } from "date-fns";

type CategorySummary = {
    [key: string]: { amount: number, percentage: string }
}
type CategoryOtherSummary = {
    [date: string]: { [category: string] : {amount: number, percentage: string }}
}

function calculateTotalAndPercentage(summary: CategoryOtherSummary){
    Object.values(summary).forEach(categories => {
        const total = Object.values(categories).reduce((sum, c) => sum + c.amount, 0);

        Object.values(categories).forEach(cat => {
        cat.percentage =
            total === 0
            ? "0"
            : ((cat.amount / total) * 100).toFixed(2);
        });
    });
}

function modifySummary(summary: CategoryOtherSummary){
    return Object.fromEntries(
        Object.entries(summary).map(([date, categoryData]) => [
            date,
            Object.entries(categoryData).map(([category, data]) => ({
                category,
                amount: data.amount,
                percentage: data.percentage,
            })),
        ])
    );
}

export function getDailybyCategory (expenses : Expense[]){
    const incomeSummary: CategoryOtherSummary = {};
    const expenseSummary: CategoryOtherSummary = {};

    expenses.forEach((exp) => {
        const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
        const date = format(dateObj, "dd MMM yyyy");
        const primaryKey = `${date}`;
        const key = exp.category;
        
        if(exp.type === "Expense"){
            if(!expenseSummary[primaryKey]) expenseSummary[primaryKey]={};
            if(!expenseSummary[primaryKey][key]) expenseSummary[primaryKey][key] = {amount: 0, percentage: "0"};

            expenseSummary[primaryKey][key].amount += exp.amount;
        }
        else{
            if(!incomeSummary[primaryKey]) incomeSummary[primaryKey]={};
            if(!incomeSummary[primaryKey][key]) incomeSummary[primaryKey][key] = {amount: 0, percentage: "0"};

            incomeSummary[primaryKey][key].amount += exp.amount;
        }
    })

    calculateTotalAndPercentage(incomeSummary);
    calculateTotalAndPercentage(expenseSummary);

    const dailyIncomeByCategory = modifySummary(incomeSummary);
    const dailyExpenseByCategory = modifySummary(expenseSummary);

    return { dailyIncomeByCategory, dailyExpenseByCategory};
}

export function getWeeklybyCategory (expenses : Expense[]){
    const incomeSummary: CategoryOtherSummary = {};
    const expenseSummary: CategoryOtherSummary = {};

    expenses.forEach((exp) => {
        const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
        const weekStart = startOfWeek(dateObj, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(dateObj, { weekStartsOn: 1 });
        const primaryKey = `${format(weekStart, "dd MMM")} - ${format(weekEnd,"dd MMM")}`;
        const key = exp.category;

        if(exp.type === "Expense"){
            if(!expenseSummary[primaryKey]) expenseSummary[primaryKey]={};
            if(!expenseSummary[primaryKey][key]) expenseSummary[primaryKey][key] = {amount: 0, percentage: "0"};

            expenseSummary[primaryKey][key].amount += exp.amount;
        }
        else{
            if(!incomeSummary[primaryKey]) incomeSummary[primaryKey]={};
            if(!incomeSummary[primaryKey][key]) incomeSummary[primaryKey][key] = {amount: 0, percentage: "0"};

            incomeSummary[primaryKey][key].amount += exp.amount;
        }
    })

    calculateTotalAndPercentage(incomeSummary);
    calculateTotalAndPercentage(expenseSummary);

    const weeklyIncomeByCategory = modifySummary(incomeSummary);
    const weeklyExpenseByCategory = modifySummary(expenseSummary);

    return { weeklyIncomeByCategory, weeklyExpenseByCategory};

}

export function getMonthlybyCategory (expenses : Expense[]){

    const incomeSummary: CategoryOtherSummary = {};
    const expenseSummary: CategoryOtherSummary = {};

    expenses.forEach((exp) => {
        const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
        const primaryKey = format(dateObj, "MMM yyyy");
        const key = exp.category;

        if(exp.type === "Expense"){
            if(!expenseSummary[primaryKey]) expenseSummary[primaryKey]={};
            if(!expenseSummary[primaryKey][key]) expenseSummary[primaryKey][key] = {amount: 0, percentage: "0"};

            expenseSummary[primaryKey][key].amount += exp.amount;
        }
        else{
            if(!incomeSummary[primaryKey]) incomeSummary[primaryKey]={};
            if(!incomeSummary[primaryKey][key]) incomeSummary[primaryKey][key] = {amount: 0, percentage: "0"};

            incomeSummary[primaryKey][key].amount += exp.amount;
        }
    })

    calculateTotalAndPercentage(incomeSummary);
    calculateTotalAndPercentage(expenseSummary);

    const monthlyIncomeByCategory = modifySummary(incomeSummary);
    const monthlyExpenseByCategory = modifySummary(expenseSummary);

    return { monthlyIncomeByCategory, monthlyExpenseByCategory};
}

export function getYearlybyCategory (expenses : Expense[]){
    

    const incomeSummary: CategoryOtherSummary = {};
    const expenseSummary: CategoryOtherSummary = {};

    expenses.forEach((exp) => {
        const dateObj = parse(exp.date, "dd MMM yyyy", new Date());

        const primaryKey = format(dateObj, "yyyy");
        const key = exp.category;

        if(exp.type === "Expense"){
            if(!expenseSummary[primaryKey]) expenseSummary[primaryKey]={};
            if(!expenseSummary[primaryKey][key]) expenseSummary[primaryKey][key] = {amount: 0, percentage: "0"};

            expenseSummary[primaryKey][key].amount += exp.amount;
        }
        else{
            if(!incomeSummary[primaryKey]) incomeSummary[primaryKey]={};
            if(!incomeSummary[primaryKey][key]) incomeSummary[primaryKey][key] = {amount: 0, percentage: "0"};

            incomeSummary[primaryKey][key].amount += exp.amount;
        }
    })

    calculateTotalAndPercentage(incomeSummary);
    calculateTotalAndPercentage(expenseSummary);

    const yearlyIncomeByCategory = modifySummary(incomeSummary);
    const yearlyExpenseByCategory = modifySummary(expenseSummary);

    return { yearlyIncomeByCategory, yearlyExpenseByCategory};
}


export function getIncomebyCategory (expenses : Expense[]){
    const { totalIncome } = balance(expenses);
    const summary: CategorySummary = {};

    expenses.forEach((exp) => {
        if(exp.type === "Expense") return;

        const key = exp.category;
        if(!summary[key]) summary[key] = { amount: 0, percentage: "0" };

        summary[key].amount += exp.amount;
        summary[key].percentage = (((summary[key].amount)/totalIncome) * 100).toFixed(2);
    })

    const sortedIncomeByCategory = Object.entries(summary).map(
        ([category, data]) => ({
            category,
            ...data,
        })
    );

    return sortedIncomeByCategory;
}
 
export function getExpensebyCategory (expenses : Expense[]){
    const {  totalExpenses } = balance(expenses);
    const summary: CategorySummary = {};

    expenses.forEach((exp) => {
        if(exp.type === "Income") return;

        const key = exp.category;
        if(!summary[key]) summary[key] = { amount: 0, percentage: "0" };

        summary[key].amount += exp.amount;
        summary[key].percentage = (((summary[key].amount)/totalExpenses) * 100).toFixed(2);
    })

    const sortedExpenseByCategory = Object.entries(summary).map(
        ([category, data]) => ({
            category,
            ...data,
        })
    );

    return sortedExpenseByCategory;

}
