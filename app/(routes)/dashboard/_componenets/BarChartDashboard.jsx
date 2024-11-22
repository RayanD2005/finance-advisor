import React from "react";

import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

function BarChartDashboard({budgetList}){
    const updatedBudgetList = budgetList.map(budget => ({
        ...budget,
        remainingBudget: budget.amount - budget.totalSpend,
      }));

    return (
        <div className="border rounded-2xl p-5">
            <h2 className="font-bold text-lg">
                Activity
            </h2>

            <ResponsiveContainer width={'80%'} height={300}>
                <BarChart data={updatedBudgetList} margin={{top:7}}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip 
                    formatter={(value, name, props) => {
                    if (name === 'Amount') {
                        return [props.payload.amount, 'Amount']; // Display the 'amount' value instead of 'remainingBudget'
                    }
                    return [value, name];
                    }} 
                    />
                    <Legend/>
                    <Bar dataKey='totalSpend' stackId='a' fill="#4845d2" name='Total Spend'/>
                    <Bar dataKey='remainingBudget' stackId='a' fill="#c3c2ff" name='Amount'/>
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
}

export default BarChartDashboard;