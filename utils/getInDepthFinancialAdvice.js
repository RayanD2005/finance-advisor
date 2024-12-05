import OpenAI from 'openai';
import { Budgets, Expenses } from '@/utils/schema'
import { db } from '@/utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'



const currency = "USD";
const period = "monthly"

const openai = new OpenAI({
    
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,

});

async function getInDepthFinancialAdvice (budgetId, totalBudget, totalIncome, totalSpend, emailAddress){
    console.log('total Budget: ', totalBudget)
    console.log('total Income: ', totalIncome)
    console.log('total Spend: ', totalSpend)

    let budgetList = []; // Initialize the variable

    // Define a function to update the variable
    function setBudgetList(newList) {
        budgetList = newList;
        console.log("Budget List Updated:", budgetList); // Optional: For debugging
    }
    


    /**
     * used to get budget List
     */
    const getBudgetList=async(emailAddress)=>{

        const result=await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`SUM(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
        totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
        }).from(Budgets)
        .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
        .where(eq(Budgets.createdBy, emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

        setBudgetList(result);

    }

    await getBudgetList(emailAddress);

    // let targetBudget = null;

    console.log("Budget Id Id: ", budgetId);

    // budgetList.forEach(element => {
    //     console.log("element id: ", element.id);
    //     if(element.id === budgetId){
    //         targetBudget = element;
    //     }
    // });

    const targetBudget = budgetList.find((element) => element.id == budgetId);

    if (!targetBudget) {
        throw new Error(`No budget found with ID ${budgetId}`);
    }

    const getExpensesForBudget = async (budget) => {
        const result = await db.select({
        ...getTableColumns(Expenses)
        }).from(Expenses)
        .where(eq(budget.id, Expenses.budgetId));
        
        const r = result;
        return result;
    }

    console.log(budgetList);

    // Get Budgets that are over their amount
    const splitBudgetList = (budgetList) => {
        const budgetsThatExceedList = [];
        const budgetsUnderAmountList = [];
        budgetList.forEach(element => {
            if (element.totalSpend > element.amount){
                budgetsThatExceedList.push(element);
            } else{
                budgetsUnderAmountList.push(element);
            }
        });

        return {budgetsThatExceedList, budgetsUnderAmountList};
    }

    const {budgetsThatExceedList, budgetsUnderAmountList} = splitBudgetList(budgetList);


    console.log(budgetsThatExceedList);
    console.log(budgetsUnderAmountList);

    budgetsThatExceedList.forEach(async element => {
        const expenses = await getExpensesForBudget(element);
        console.log(expenses);
        console.log(formatExpenses(expenses));
    })

    const formatExpenses = (expenses) => {
        let result = ""
        expenses.forEach(element => {
            result += `${element.name} : ${element.amount} || `
        })

        return result;

    }

    try {
        const systemPrompt = `You are a financial advisor. You will be provided with a user's total Budget, total Income and total Expenses. 
        Using those you must give them professional financial advice. All the financial data is ${period}`

        const finalSystemPrompt = `You are a financial advisor. You will be provided with a user prompt which is previous AI advice. 
        Condense and summarize the usesr's prompt into no more than 5 sentences.`

        let lastUserPrompt = "";

        // Process each budget that exceeds its limit
        // for (const element of budgetsThatExceedList) {
        //     const expenseList = await getExpensesForBudget(element);
        //     const expenses = formatExpenses(expenseList);
        //     const userPrompt = `Here is my ${period} financial data for my ${element.name} budget: 
        //     - Budget Amount: ${element.amount} ${currency}
        //     - Total Expenses: ${element.totalSpend} ${currency}
        //     - Expenses: ${expenses}
        //     Provide clear and actionable financial advice to help me manage my budget and finances effectively. Be specific and Limit your response to 4 sentences.`;

        //     const chatCompletion = await openai.chat.completions.create({
        //         model: 'gpt-4',
        //         messages: [
        //             { role: "system", content: `You are a financial advisor. All the financial data is ${period}` },
        //             { role: 'user', content: userPrompt },
        //         ],
        //     });

        //     lastUserPrompt += chatCompletion.choices[0].message.content;
        // }

        const expenseList = await getExpensesForBudget(targetBudget);
        const expenses = formatExpenses(expenseList);
        const userPrompt = `Here is my ${period} financial data for my ${targetBudget.name} budget: 
        - Budget Amount: ${targetBudget.amount} ${currency}
        - Total Expenses: ${targetBudget.totalSpend} ${currency}
        - Expenses: ${expenses}
        Provide clear and actionable financial advice to help me manage my budget and finances effectively. Be specific and Limit your response to 4 sentences.`;

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: "system", content: `You are a financial advisor. All the financial data is ${period}` },
                { role: 'user', content: userPrompt },
            ],
        });

        lastUserPrompt += chatCompletion.choices[0].message.content;

        console.log("Compiled User Prompt:", lastUserPrompt);

        // Final summary of advice
        // const finalChatCompletion = await openai.chat.completions.create({
        //     model: 'gpt-4',
        //     messages: [
        //         { role: "system", content: "You are a financial advisor. Condense and summarize the user's prompt into no more than 5 sentences. Be specific about what budget you are talking about. The prompt you give should address the user directly" },
        //         { role: 'user', content: lastUserPrompt },
        //     ],
        // });

        // return finalChatCompletion.choices[0].message.content;

        return lastUserPrompt;
        
    } catch (error) {
        console.log(error);
    }
}

export default getInDepthFinancialAdvice;