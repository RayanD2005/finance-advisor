import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, {useState} from "react";
import { db } from "@/utils/dbConfig";
import { Incomes, Budgets } from "@/utils/schema";
import { desc, eq, getTableColumns, sql, } from "drizzle-orm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditIncome from "./EditIncome";
import { useUser } from "@clerk/nextjs";

function IncomeItem({ budget, onDelete, getIncomelist }) {
    const { id } = budget;
    const route = useRouter();

    const calculateProgressPerc = () => {
        const perc = (budget.totalSpend / budget.amount) * 100;
        return perc > 100 ? 100 : perc.toFixed(2);
    };


    const getIncomeInfo = () => { 
        getIncomelist(); 
    };

    const deleteIncome = async () => {
        try{
            const deleteIncomeResult = await db
            .delete(Incomes)
            .where(eq(Incomes.id, id))
            .returning();
    
            toast("Income Deleted!");
            onDelete(id);
            route.replace("/dashboard/incomes");
        }catch(error){
            console.error("Error deleting income: ", error);
            toast("Failed to delete income");
        }
        
    };

    return (
        <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[150px] w-[70%] mx-auto">
            <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
                        {budget?.icon}
                    </h2>
                    <div>
                        <h2 className="font-bold">{budget.name}</h2>
                        {/* <h2 className="text-sm text-gray-500">{budget.totalItem} Item</h2> */}
                    </div>
                </div>
                
                <h2 className="font-bold text-primary text-lg"> ${budget.amount}</h2>
            </div>

            <div className="pt-2 mt-3 flex flex-row gap-2">
                <EditIncome incomeInfo={budget} refreshData={() => getIncomeInfo()} />
                <div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-auto flex gap-2 rounded-full" variant="destructive">
                                <Trash className="w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    current income along with any associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteIncome()}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                
            </div>
        </div>
    );
}

export default IncomeItem;