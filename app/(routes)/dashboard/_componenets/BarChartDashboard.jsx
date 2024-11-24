import React from "react";

import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

function BarChartDashboard({budgetList}){
    const updatedBudgetList = budgetList.map(budget => ({
        ...budget,
        amount: budget.amount,
        totalSpend: budget.totalSpend,
        remainingBudget: Math.abs(budget.amount - budget.totalSpend),
        dynamicKey: budget.amount - budget.totalSpend < 0 ? budget.amount : budget.totalSpend,
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
                    const remainingBudget = props.payload.amount - props.payload.totalSpend
                    const style = name === "Total Spend" && remainingBudget < 0 ? { color: "red" } : {};
                    return [
                        <span style={style}>
                        {props.payload.totalSpend}
                        </span>,
                        name,
                    ];

                    //return [value, name];
                    }} 
                    />
                    <Legend/>
                    <Bar dataKey="dynamicKey" stackId='a' fill="#4845d2" name='Total Spend' stroke="#000"/>
                    <Bar dataKey='remainingBudget' stackId='a' fill="#c3c2ff" name='Amount'  
                    shape={({ x, y, width, height, payload }) => {
                        const fillColor = payload.amount - payload.totalSpend < 0 ? 'red' : '#c3c2ff';
                        return (
                          <rect 
                            x={x} 
                            y={y} 
                            width={width} 
                            height={height} 
                            fill={fillColor} 
                            stroke="#000" // Optional: Add border for better clarity
                            
                            
                          />
                        );
                      }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
}

export default BarChartDashboard;