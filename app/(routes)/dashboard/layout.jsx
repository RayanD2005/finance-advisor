'use client'
import React, {useEffect} from "react";
import SideNav from "./_componenets/SideNav";
import DashboardHeader from "./_componenets/DashboardHeader";

import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }){
    const {user} = useUser();
    const router = useRouter();

    //Check budget & User when a new user is logged in
    useEffect(() => {
        user && checkUserBudget()
    }, [user])

    const  checkUserBudget = async () => {
        const result = await db.select.from(Budgets).where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        // If user hasnt 'created' a budgets table
        if (result?.length === 0){
            router.replace('/dashboard/budgets')
        }
    }

    return (
        <div>
            <div className="fixed md:w-64 hidden md:block">
                <SideNav/>
            </div>
            <div className="md:ml-64">
                <DashboardHeader/>
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;