import { Brain } from 'lucide-react';
import getFinancialAdvice from "@/utils/getFinancialAdvice";
import getInDepthFinancialAdvice from "@/utils/getInDepthFinancialAdvice";

import { db } from "@/utils/dbConfig";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/utils/schema";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

function FinancialAdviceCard({budgetId}) {
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [financialAdvice, setFinancialAdvice] = useState("");
    const [inDepthFinancialAdvice, setInDepthFinancialAdvice] = useState("");

    console.log("ID: ",budgetId)

    

    const [isClient, setIsClient] = useState(false); 

    const {user}=useUser();

    const [budgetList, setBuidgetList] = useState([])
    const [incomeList, setIncomeList] = useState([])
    const [expenseList, setExpensesList] = useState([])

    useEffect(() => {
        setIsClient(true);
      }, []);
  

    useEffect(() => {
        user && getBudgetList()
    }, [user]);

    const getBudgetList = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`SUM(${Expenses.amount}::NUMERIC)`.mapWith(Number),
                totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number)
            }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id));
    
            setBuidgetList(result);
            getAllExpenses();
            getIncomeList();
        } catch (error) {
            console.log(error);
        }
    }

    const getAllExpenses = async () => {
        const result = await db.select({
            id: Expenses.id,
            name: Expenses.name,
            amount: Expenses.amount,
            createdAt: Expenses.createdAt
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expenses.id));

        setExpensesList(result);
    }

    const getIncomeList = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Incomes),
                totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(Number),
            }).from(Incomes)
            .groupBy(Incomes.id);
    
            
            setIncomeList(result);
            
        } catch (error) {
            console.log('Error fetching income list: ', error);
        }
    }

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
        if (budgetList.length > 0 || incomeList.length > 0){
            CalculateCardInfo();
        }
    }, [budgetList, incomeList]);

    useEffect(() => {
      setFinancialAdvice("Loading financial advice...");
      if (isClient && (totalBudget > 0 || totalIncome > 0 || totalSpend > 0)) {
        console.log("Commencing financial advice retrival");
        const fetchFinancialAdvice = async () => {
          const cachedAdviceKey = `${totalBudget}-${totalIncome}-${totalSpend}-${budgetId}`;
  
          if (typeof window !== "undefined") {
            const cachedAdvice = localStorage.getItem(cachedAdviceKey);
            
            if (cachedAdvice && cachedAdvice !="undefined") {
              console.log("Cached advice:", cachedAdvice);
              setFinancialAdvice(cachedAdvice);
              return;
            }
          }

          const inDepthAdvice = await getInDepthFinancialAdvice(
            budgetId,
            totalBudget,
            totalIncome,
            totalSpend,
            user?.primaryEmailAddress?.emailAddress
          );

          console.log("Fetched advice:", inDepthAdvice);
  
          setFinancialAdvice(inDepthAdvice);
  
          if (typeof window !== "undefined") {
            localStorage.setItem(cachedAdviceKey, inDepthAdvice);
          }
        };
  
        fetchFinancialAdvice();
      }
    }, [isClient, totalBudget, totalIncome, totalSpend]);
    

    const CalculateCardInfo = () => {
        let totalBudget_ = 0;
        let totalSpend_ = 0;
        let totalIncome_ = 0;

        budgetList.forEach(element => {
            totalBudget_  += Number(element.amount);
            totalSpend_ += element.totalSpend;
        });

        incomeList.forEach(element => {
            totalIncome_ += element.totalAmount
        });

        setTotalBudget(totalBudget_);
        setTotalIncome(totalIncome_);
        setTotalSpend(totalSpend_);
    };

    return (
        <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
                <div className="">
                  <div className="flex mb-2 flex-row space-x-1 items-center ">
                    <h2 className="text-textColor text-md ">Aura AI</h2>
                    <Brain
                      className="rounded-full text-white w-10 h-10 p-2
        bg-gradient-to-r
        from-violet-700
        via-violet-500
        to-violet-300
        background-animate"
                    />
                  </div>
                  <h2 className="text-textColor font-semibold text-md">
                    {financialAdvice || "Loading financial advice..."}
                  </h2>
                </div>
        </div>
    )
}

export default FinancialAdviceCard;