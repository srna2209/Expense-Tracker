import { cache } from "react";
import { getUserFromSession } from "../core/session";
import { cookies } from "next/headers";

export const getCurrentUser = cache(async () => {
    // console.log(getUserFromSession(await cookies()))
    return getUserFromSession(await cookies())
})