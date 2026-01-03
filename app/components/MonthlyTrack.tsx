'use client'

import React from "react"; 
import { parse } from "date-fns";
import { Expense } from "../page";

type MonthlySummary = {
  [month: string]: { income: number; expense: number };
};

export const getMonthlySummary = (expenses: Expense[]): MonthlySummary => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const summary: MonthlySummary = {};

  expenses.forEach(exp => {
    const dateObj = parse(exp.date, "dd MMM yyyy", new Date());
    const monthName = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const key = `${monthName} ${year}`;

    if (!summary[key]) summary[key] = { income: 0, expense: 0 };

    if (exp.type === "Income") summary[key].income += exp.amount;
    else if (exp.type === "Expense") summary[key].expense += exp.amount;
  });

  return summary;
};
