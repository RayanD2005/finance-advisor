"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Incomes, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalSpend: sql`SUM(${Expenses.amount}::NUMERIC)`.mapWith(Number),
        totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.budgetId))
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));
    setIncomelist(result);
  };

  // Callback to update incomelist after deletion
  const handleDeleteIncome = (deletedId) => {
    setIncomelist((prevList) => prevList.filter((item) => item.id !== deletedId));
  };

  return (
    <div className="mt-7">
        <div className="mb-5 p-5">
            <CreateIncomes refreshData={() => getIncomelist()} />
        </div>
        <div
            className="flex flex-col gap-5"
        >
            
            {incomelist?.length > 0
            ? incomelist.map((budget, index) => (
                <IncomeItem budget={budget} onDelete={handleDeleteIncome} key={index} />
                ))
            : [1, 2, 3, 4, 5].map((item, index) => (
                <div
                    key={index}
                    className="w-[200px] bg-slate-200 rounded-lg
                h-[150px] animate-pulse"
                ></div>
                ))}
        </div>
    </div>
  );
}

export default IncomeList;