"use client"

import { useRef, useState } from "react";
import { signInSchema } from "../schemas";
import { z } from "zod"; 
import { signIn } from "../action";
import Link from "next/link";
import Image from "next/image";


export const SignInForm = () => {

    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [error, setError] = useState<string>();
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    function validateEmail(value: string) {
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
        return "";
    }

    function validatePassword(value: string) {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);

        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if (emailErr || passwordErr) return;
        
        const signInData = {
            email,
            password,
        }
        const currentError = await signIn(signInData);
        // console.log("current error passed")
        setError(currentError);
    }

    const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value));
    }

    const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
    }

    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center items-middle">
            <div className="pt-8 bg-gray-700 rounded-lg border border-gray-300">
                <div className=" mx-6 py-5 flex flex-row justify-start text-white border-t border-t-white border-b border-b-white ">
                    <div className="w-11 flex flex-col justify-center">
                        <Image
                            src="/logo.png"
                            alt="Account info"
                            width={32} 
                            height={32}
                            style={{ objectFit: 'contain' }}
                            className="p-1 h-9 w-9 bg-gray-700"
                        />
                    </div>
                    <div className="text-2xl">
                        Expense Tracker
                    </div>
                </div>
                <div className="w-xs bg-gray-700 p-5 flex flex-col justify-center rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        {error && <p className="text-white text-sm font-thin pl-1">{error}</p>}
                        <div>
                            <input 
                                ref={emailRef}
                                type="email" 
                                name="email" 
                                placeholder="Email"
                                defaultValue={email}
                                onChange={handleEmailInput}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        passwordRef.current?.focus();
                                    }
                                }}
                                className="border-2 border-gray-500 bg-gray-50 text-sm text-gray-500 p-2 rounded-md w-full placeholder-gray-300 hover:bg-gray-100 focus:border-gray-500 focus:outline-none "/>
                            {emailError && <p className="text-white text-sm font-thin pl-1">{emailError}</p>}
                        </div>
                        <div>
                            <input 
                                ref = {passwordRef}
                                type="password" 
                                // name="password" 
                                // minLength={8}
                                placeholder="Password"
                                // defaultValue={password}
                                onChange={handlePasswordInput}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                                className="border-2 border-gray-500 bg-gray-50 text-sm text-gray-500 p-2 rounded-md w-full placeholder-gray-300 hover:bg-gray-100 focus:border-gray-500 focus:outline-none "/>
                            {passwordError && <p className="text-white text-sm font-thin pl-1">{passwordError}</p>}
                        </div>
                        <div className="flex flex-row justify-center pt-2">
                            <button type="submit" disabled={!!emailError || !!passwordError} className="px-4 py-1.5 border border-gray-400 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-transform duration-100 ease-out active:scale-95">
                            Sign In
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex flex-row justify-end -mt-2 pr-6 py-5 mb-4 gap-1">
                    <div className="text-sm font-normal text-gray-300 rounded-lg">Don't have an account?</div>
                    <Link href="/sign-up" className="text-sm font-normal text-gray-200 rounded-lg hover:text-white transition-transform duration-100 ease-out active:scale-95">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}