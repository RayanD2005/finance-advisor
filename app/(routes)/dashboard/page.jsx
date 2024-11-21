'use client';
import React, {useState, useEffect}from "react";
import { db } from "@/utils/dbConfig";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_componenets/CardInfo";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/utils/schema";

import BarChartDashboard from "./_componenets/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";





function Dashboard(){
    const { user } = useUser();

    const [budgetList, setBuidgetList] = useState([])
    const [incomeList, setIncomeList] = useState([])
    const [expenseList, setExpensesList] = useState([])

    useEffect(() => {
        user && getBudgetList()
    }, [user]);

    const getBudgetList = async () => {
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
                totalAmount: sql`sum(cast(${Incomes.amount} as numeric()))`.mapWith(Number),
            }).from(Incomes)
            .groupBy(Incomes.id);
    
            
            setIncomeList(result);
            
        } catch (error) {
            console.log('Error fetching income list: ', error);
        }
    }

    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (user) {
    //         getBudgetList().finally(() => setLoading(false));
    //     }
    // }, [user]);

    // if (loading) {
    //     return <div>Loading dashboard...</div>;
    // }

    console.log("Expense List: ", expenseList);

    return (
        
        <div className="p-8">
            <h2 className="font-bold text-4xl">Hi, {user?.fullName}</h2>
            <p className="text-gray-500 ">Lets save you some money</p>

            <CardInfo budgetList={budgetList} incomeList={incomeList} />

            <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
                <div className="lg:col-span-2">
                    <BarChartDashboard budgetList={budgetList}/>

                    <ExpenseListTable expensesList={expenseList} refreshData={() => getBudgetList()}/>
                </div>

                <div className="grid gap-5">
                    <h2 className="font-bold text-lg">Latest Budgets</h2>
                    {budgetList?.length > 0 ? budgetList.map((budget, index) =>(
                        <BudgetItem budget={budget} key={index} />
                    )) : [1,2,3,4].map((item, index) => (
                        <div className="h-[180xp] w-full bg-slate-200 lg animate-pulse" key={item}>

                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}

export default Dashboard;