import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = token.userId;
    const accessToken = token.accessToken;
    const providerAccountId = token.providerAccountId;
    const name = token.name;
    const image = token.image;
    const email = token.email;
    return NextResponse.json({
        message: "data for token",
        userId,
        accessToken,
        providerAccountId,
        name,
        email,
        image
    })
}