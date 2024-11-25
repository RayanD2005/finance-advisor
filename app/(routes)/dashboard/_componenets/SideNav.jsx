import React, {useEffect} from "react";
import Image from "next/image";
import {LayoutGrid,
    PiggyBank,
    ReceiptText,
    ShieldCheck,
    CircleDollarSign,
    BookOpen,
    Landmark,
    Gem,
    Wallet
    

} from 'lucide-react';

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { index } from "drizzle-orm/mysql-core";


function SideNav(){
    const menuList = [
        {
            id: 1,
            name: "Dashboard",
            icon: BookOpen,
            path: "/dashboard"
        },
        {
            id: 2,
            name: "Incomes",
            icon: CircleDollarSign,
            path: "/dashboard/incomes"
        },
        {
            id: 3,
            name: "Budgets",
            icon: Wallet,
            path: "/dashboard/budgets"
        },
        {
            id: 4,
            name: "Expenses",
            icon: ReceiptText,
            path: "/dashboard/expenses"
        },
        {
            id: 5,
            name: "Upgrade",
            icon: Gem,
            path: "/dashboard/upgrade"
        },
    ];

    const path = usePathname();

    useEffect(() => {
        console.log(path)
    }, [path]);

    return (
        <div className="bg-neutral-800 h-screen p-5">
            <div className="flex flex-row items-center">
                <Image src={"./chart-donut.svg"} alt="logo" width={50} height={30} />
                <span className="text-primary font-bold text-4xl">Aura</span>
            </div>

            <div className="mt-5">
                {menuList.map((menu, index) => (
                    <Link
                    href ={menu.path} key={index}
                    >
                        <h2 className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-4 cursor-pointer rounded-full hover:text-primary hover:bg-blue-100 ${path == menu.path && 'text-primary bg-blue-100'}`}>
                            <menu.icon/>
                            {menu.name}
                        </h2>
                    
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideNav;


