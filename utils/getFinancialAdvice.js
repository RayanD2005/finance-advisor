import OpenAI from 'openai';

const currency = "USD";

const openai = new OpenAI({
    
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,

});

async function getFinancialAdvice (totalBudget, totalIncome, totalSpend){
    try {
        const userPrompt = `You are a financial advisor helping users optimize their budget. Here is the user's financial data: 
        - Total Budget: ${totalBudget} ${currency}
        - Total Income: ${totalIncome} ${currency}
        - Total Expenses: ${totalSpend} ${currency}
        Provide clear and actionable financial advice to help the user manage their budget effectively. Limit your response to 4 sentences.`;

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4', 
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