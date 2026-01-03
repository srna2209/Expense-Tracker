import { z } from "zod";
import crypto from "crypto";
import { redisClient } from "@/redis/redis";

const SESSION_EXPIRATION_SECONDS = 60*60*24*7
const COOKIE_SESSION_KEY = "session-id"

const sessionSchema = z.object({ id: z.string(), name: z.string(), email: z.string()})

export type Cookies = {
    set: (
        key: string,
        value: string,
        options: {
            secure?: boolean,
            httpOnly?: boolean,
            sameSite?: "strict" | "lax"
            expires?: number
        }
     ) => void
    get: (key: string) => {name: string, value: string} | undefined 
    delete: (key: string) => void
}
export async function createUserSession(user: z.infer<typeof sessionSchema>, cookies: Pick<Cookies, "set">)
{
    const sessionId = crypto.randomBytes(512).toString("hex").normalize()
    await redisClient.set( `session:${sessionId}`, JSON.stringify(sessionSchema.parse(user)) ,{
        ex: SESSION_EXPIRATION_SECONDS
    })
    // console.log(sessionId)
    // console.log("REDIS URL:", process.env.UPSTASH_REDIS_REST_URL)

    // console.log("SET OK:", await redisClient.exists(`session:${sessionId}`))
    setCookie(sessionId, cookies)
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
    })
}

export async function getUserFromSession(cookies : Pick<Cookies, "get">){
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
    if(sessionId == null) return null;
    // console.log(sessionId)
    return getUserSessionById(sessionId)
}

async function getUserSessionById(sessionId: string){
    const rawUser = await redisClient.get(`session:${sessionId}`);
    // console.log("REDIS URL:", process.env.UPSTASH_REDIS_REST_URL)

    // console.log(rawUser)
    const { success, data:user } = sessionSchema.safeParse(rawUser);
    
    return success? user : null;
}

export async function removeUserFromSession(cookies: Pick<Cookies, "get" | "delete">){
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
    if(sessionId == null) return null;

    await redisClient.del(`session:${sessionId}`);
    cookies.delete(COOKIE_SESSION_KEY);
}