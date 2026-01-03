"use client"

import { LogOutButton } from "@/auth/nextjs/components/LogOutButton";
import Image from "next/image";
import { useState } from "react"

export default function Account({ userName, userEmail }:{ userName: string; userEmail: string }){
    const [ show, setShow ] = useState(false);  

    return (
    <>
        <button onClick={() => setShow(!show)}>
            <div className="w-fit flex flex-col cursor-pointer">
                <Image
                src="/account.svg"
                alt="Account info"
                width={32} 
                height={32}
                style={{ objectFit: 'contain' }}
                className="h-8 w-8 bg-gray-700 rounded-full hover:bg-gray-700 focus: outline-none transition-transform duration-200 ease-out active:scale-95"
                />
            </div>
        </button>
        {show && 
            <div className="absolute z-10 top-14 right-6 py-2 flex flex-col bg-gray-50 w-40 rounded-lg ">
                <div className="px-3 pb-2 border-b border-b-gray-300">
                    <div className=" text-md font-normal">{userName}</div>
                    <div className=" text-xs font-thin">{userEmail}</div>
                </div>
                <LogOutButton/>
            </div>}
        </>
    )
    
}