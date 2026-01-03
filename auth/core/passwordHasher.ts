import crypto from "crypto";

export function generateSalt() {
    return crypto.randomBytes(16).toString("hex")
}


export function hashPassword(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (error, hash) => {
        if(error) reject(error) 
        
        resolve(hash.toString("hex"))
        })
    })
}

export async function comparePasswords({hashedPassword, password, salt} : {hashedPassword: string, password: string, salt: string}){
    const inputHashedPassword = await hashPassword(password, salt);
    const bufferA = Buffer.from(inputHashedPassword, "hex");
    const bufferB = Buffer.from(hashedPassword, "hex");

    if (bufferA.length !== bufferB.length) { return false };
    return crypto.timingSafeEqual(bufferA,bufferB);
}
