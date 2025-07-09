import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { refreshAccessToken } from "@/services/account";
export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const now = Date.now();
    const expiresAt = Number(token.accessTokenExpires || 0);
    if (now > expiresAt) {
        try {
            const refreshResponse = await refreshAccessToken(token);
            const data = refreshResponse.data;
            return NextResponse.json({
                message: "data for token",
                ...data
            })
        } catch (error) {
            return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 });
        }
    }
    const userId = token.userId;
    const id_token = token.id_token;
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
        image,
        id_token
    })
}