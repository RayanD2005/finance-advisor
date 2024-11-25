import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";


function ExpenseListTable({ expensesList, refreshData }) {
  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast("Expense Deleted!");
      refreshData();
    }
  };

  const getBudgetForExpense = async (expense) => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`SUM(${Expenses.amount}::NUMERIC)`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.id, expense.budgetId))
      .groupBy(Budgets.id);
  
    return result[0] || null; // Return the first matching budget or null if not found
  };
  
  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-5 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.map((expenses, index) => (
        <div key={index} className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2">
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2
            onClick={() => deleteExpense(expenses)}
            className="text-red-500 cursor-pointer"
          >
            Delete
          </h2>
          {/* <h2>
            <Trash
              className="text-red-500 cursor-pointer"
              onClick={() => deleteExpense(expenses)}
            />
          </h2> */}
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;