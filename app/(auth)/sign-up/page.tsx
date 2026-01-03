
import { SignUpForm } from "@/auth/nextjs/components/SignUpForm";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { redirect } from "next/navigation";


export default async function SignUp() {
    const user = await getCurrentUser();
    if(user) redirect("/");
    return <>
        <SignUpForm/>
    </>
}