"use client"

import { logOut } from "../action";

export function LogOutButton(){
    return <>
        <button onClick={async () => await logOut()} className="px-3 py-2 text-xs font-normal text-gray-500 text-start hover:bg-gray-100 focus:outline-none">
            Log Out
        </button>
    </>
}