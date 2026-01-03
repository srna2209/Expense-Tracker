
import { SignInForm } from "@/auth/nextjs/components/SignInForm";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import Link from "next/link";
import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";

export default async function SignIn() {
    const user = await getCurrentUser();
    if(user) redirect("/");
    // const router = useRouter();

    return <>
        <div>
            {/* onClick={() => router.push("/")}> */}
            <SignInForm/>
        </div>
    </>
}