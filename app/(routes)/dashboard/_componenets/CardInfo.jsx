import {LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  CircleDollarSign,
  BookOpen,
  Landmark,
  Sparkles,
  Wallet,
  Brain,
  Coins
  

} from 'lucide-react';
import formatNumber from "@/utils";
import getFinancialAdvice from "@/utils/getFinancialAdvice";

import React, { useEffect, useState } from 'react';

function CardInfo({budgetList, incomeList}){
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [financialAdvice, setFinancialAdvice] = useState("");

    const [isClient, setIsClient] = useState(false); 

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
        if (budgetList.length > 0 || incomeList.length > 0){
            CalculateCardInfo();
        }
    }, [budgetList, incomeList]);

    useEffect(() => {
      if (isClient && (totalBudget > 0 || totalIncome > 0 || totalSpend > 0)) {
        const fetchFinancialAdvice = async () => {
          const cachedAdviceKey = `${totalBudget}-${totalIncome}-${totalSpend}`;
  
          if (typeof window !== "undefined") {
            const cachedAdvice = localStorage.getItem(cachedAdviceKey);
  
            if (cachedAdvice) {
              setFinancialAdvice(cachedAdvice);
              return;
            }
          }
  
          const advice = await getFinancialAdvice(
            totalBudget,
            totalIncome,
            totalSpend
          );
  
          setFinancialAdvice(advice);
  
          if (typeof window !== "undefined") {
            localStorage.setItem(cachedAdviceKey, advice);
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
        <div>
          {budgetList?.length > 0 ? (
            <div>
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
    
              <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-7 border rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-textColor text-sm">Total Budget</h2>
                    <h2 className="text-textColor font-bold text-2xl">
                      ${formatNumber(totalBudget)}
                    </h2>
                  </div>
                  <Wallet className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                </div>
                <div className="text-textColor p-7 border rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-sm">No. Of Budgets</h2>
                    <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
                  </div>
                  <Coins className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                </div>
                <div className="text-textColor p-7 border rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-sm">Total Expenses</h2>
                    <h2 className="font-bold text-2xl">
                      ${formatNumber(totalSpend)}
                    </h2>
                  </div>
                  <ReceiptText className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                </div>
                <div className="text-textColor p-7 border rounded-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-sm">Sum of Income Streams</h2>
                    <h2 className="font-bold text-2xl">
                      ${formatNumber(totalIncome)}
                    </h2>
                  </div>
                  <CircleDollarSign className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((item, index) => (
                <div
                  className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
                  key={index}
                ></div>
              ))}
            </div>
          )}
        </div>
      );

}

export default CardInfo;