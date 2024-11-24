import OpenAI from 'openai';

const openai = new OpenAI({
    
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,

});

async function getFinancialAdvice (totalBudget, totalIncome, totalSpend){
    try {
        const userPrompt = `A user is currently trying to budget their money as efficently as possible. 
        Based on the following data: 
        Total Budget: ${totalBudget}
        Expenses: ${totalSpend}
        Incomes: ${totalIncome}
        give the user best financial advice that you can (no longer than 4 sentences):
        `

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o', 
            messages: [{ role: "system", content: "You are a financial advisor." },
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