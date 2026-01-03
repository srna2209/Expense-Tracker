import { getCurrentUser } from "@/auth/nextjs/currentUser";
import All from "./components/All";
import Account from "../components/Account";
import Image from "next/image";
import SignIn from "../(auth)/sign-in/page";


export default async function Transactions() {
    const user = await getCurrentUser();
    return (
        (user == null)?(
            <SignIn/>
        ):(
            <div className="bg-gray-500">
                <div className="fixed top-0 md:pl-12 pl-5 flex flex-row bg-gray-700 w-full">
                    <div className="flex flex-row justify-start">
                        <div className="w-11 pt-2 flex flex-col justify-center">
                        <Image
                            src="/logo.png"
                            alt="Account info"
                            width={32} 
                            height={32}
                            style={{ objectFit: 'contain' }}
                            className="p-1 h-9 w-9 bg-gray-700"
                        />
                        </div>
                        <div className="text-white text-2xl sm:text-3xl p-5 pl-0 pt-6">Expense Tracker</div>
                    </div>
                    <div className="absolute top-4 sm:right-8 right-3 p-3">
                        <Account userName={user.name} userEmail={user.email}/>
                    </div>
                </div>
                <All userId={user.id}/>
                <div className="p-8 bg-gray-300 text-gray-700 text-xs flex flex-col items-center">
                    All rights reserved. Copyright @ExpenseTracker
                </div>
            </div>
        )
    )
}