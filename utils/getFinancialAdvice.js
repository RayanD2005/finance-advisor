import OpenAI from 'openai';

const currency = "USD";
const period = "monthly"

const openai = new OpenAI({
    
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,

});

async function getFinancialAdvice (totalBudget, totalIncome, totalSpend){
    console.log('total Budget: ', totalBudget)
    console.log('total Income: ', totalIncome)
    console.log('total Spend: ', totalSpend)

    try {
        const userPrompt = `Here is my ${period} financial data: 
        - Total Budget: ${totalBudget} ${currency}
        - Total Income: ${totalIncome} ${currency}
        - Total Expenses: ${totalSpend} ${currency}
        Provide clear and actionable financial advice to help me manage my budget and finances effectively. Limit your response to 5 sentences.`;

        const systemPrompt = `You are a financial advisor. You will be provided with a user's total Budget, total Income and total Expenses. 
        Using those you must give them professional financial advice. All the financial data is ${period}`

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4', 
            messages: [{ role: "system", content: systemPrompt },
                {
                role: 'user',
                content: userPrompt
            }]
        });

        const advice = chatCompletion.choices[0].message.content
        return advice;
        
    } catch (error) {
        console.log(error);
    }
}

export default getFinancialAdvice;