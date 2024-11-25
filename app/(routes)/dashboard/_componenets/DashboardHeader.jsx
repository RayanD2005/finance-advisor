import { UserButton } from "@clerk/nextjs"
import React from "react"

function DashboardHeader() {
    return (
        <div className="bg-neutral-800 bg-back p-5 shadow-sm flex justify-between">
            <div></div>
            <div>
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}

export default DashboardHeader;