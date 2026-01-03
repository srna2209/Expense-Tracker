'use client'; 

import { useMemo } from 'react';
import { Expense } from '../page'; 

export const balance = (expenses: Expense[]) => {
  const totalIncome = useMemo(() => {
    return expenses
      .filter(exp => exp.type === 'Income') 
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const totalExpenses = useMemo(() => {
    return expenses
      .filter(exp => exp.type === 'Expense') 
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]); 

  const netBalance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]); 

  return { totalIncome, totalExpenses, netBalance };
};