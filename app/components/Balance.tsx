'use client'; 
import { Expense } from '../page'; 

export const balance = (expenses: Expense[]) => {
  const totalIncome = expenses
      .filter(exp => exp.type === 'Income') 
      .reduce((sum, exp) => sum + exp.amount, 0);
  ;

  const totalExpenses = expenses
      .filter(exp => exp.type === 'Expense') 
      .reduce((sum, exp) => sum + exp.amount, 0);
  

  const netBalance = totalIncome - totalExpenses; 

  return { totalIncome, totalExpenses, netBalance };
};