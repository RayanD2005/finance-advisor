import { Incomes } from "@/utils/schema";
import Link from "next/link";
import React from "react";

function BudgetItem({ budget }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  /**
   * Used to Delete budget
   */
  const deleteIncome = async () => {
    const deleteIncomeResult = await db
      .delete(Incomes)
      .where(eq(Incomes.id, id))
      .returning();

    toast("Income Deleted !");
    route.replace("/dashboard/incomes");
  };

  return (
    <Link href={"/dashboard/expenses/" + budget?.id}>
      <div
        className="p-5 border rounded-2xl
    hover:shadow-md cursor-pointer h-[170px]"
      >
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2
              className="text-2xl p-3 px-4
              bg-slate-100 rounded-full 
              "
            >
              {budget?.icon}
            </h2>
            <div>
              <h2 className="font-bold">{budget.name}</h2>
              <h2 className="text-sm text-gray-500">{budget.totalItem} Item(s)</h2>
            </div>
          </div>
          <h2 className="font-bold text-primary text-lg"> ${budget.amount}</h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">
              ${budget.totalSpend ? budget.totalSpend : 0} Spent
            </h2>
            <h2 className={budget.amount - budget.totalSpend < 0 ? "text-xs text-red-600" : "text-xs text-slate-400"}>
              {budget.amount - budget.totalSpend < 0 ? `$${Math.abs(budget.amount - budget.totalSpend)} Over`: `${budget.amount - budget.totalSpend} Remaining`} 
            </h2>
          </div>
          <div
            className="w-full
              bg-slate-300 h-2 rounded-full"
          >
            <div
              className={budget.amount - budget.totalSpend < 0 ? "bg-red-700 h-2 rounded-full": "bg-primary h-2 rounded-full"}
              style={{
                width: `${calculateProgressPerc()}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;