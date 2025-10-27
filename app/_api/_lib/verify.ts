import { randomBytes } from "crypto";

export async function generateVerificationToken(): Promise<string> {
    const token = randomBytes(32).toString("hex");
    return token;
}