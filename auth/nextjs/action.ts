"use server"

import {z} from "zod";
import { redirect } from "next/navigation";
import { signInSchema, signUpSchema } from "./schemas";
import { generateSalt, hashPassword } from "../core/passwordHasher";
import UserModel from "@/app/lib/models/User";
import { createUserSession, removeUserFromSession } from "../core/session";
import { cookies } from "next/headers";
import { comparePasswords } from "../core/passwordHasher";
import { ConnectDB } from "@/app/lib/config/db"

export async function signIn(unSafeData: z.infer<typeof signInSchema>)
{
    await ConnectDB();

    const { success, data } = signInSchema.safeParse(unSafeData);

    if(!success) return "Invalid email or password";

    const user = await UserModel.findOne({email: data.email});
    if(user==null) return "Email not found";

    if(user.password==null) return "Enter password" 
    
    if(user.salt==null) return "Unable to sign you in"
    // console.log(user.salt);
    // console.log(user.password);
    // console.log(data.password);
    const isCorrectPassword = await comparePasswords({
        hashedPassword: user.password,
        password: data.password,
        salt: user.salt
    })

    if(!isCorrectPassword) return "Invalid email or password";

    await createUserSession(user, await cookies());
    redirect("/")
}



export async function signUp(unSafeData: z.infer<typeof signUpSchema>)
{

    await ConnectDB();

    const { success, data } = signUpSchema.safeParse(unSafeData);

    if(!success) return "Unable to create account";

    const existingUser = await UserModel.findOne({email: data.email});
    if(existingUser!=null) return "Account already exists";
    try {

        const salt = generateSalt();
        const hashedPassword = await hashPassword(data.password, salt);

        const userData = {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            salt,   
        }
        
        const user = await UserModel.create(userData);
        // const userformed = user.toJSON();
        // console.log(userformed);
        if(user == null) return "Unable to create account";

        await createUserSession(user, await cookies());


    } catch {
        return "Unable to create account"
    }
    redirect("/")
}

export async function logOut()
{
    await removeUserFromSession(await cookies())
    redirect("/")
}
