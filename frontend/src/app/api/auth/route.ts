import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        const userId = token.userId || "";
        const id_token = token.id_token || "";
        const accessToken = token.accessToken || "";
        const providerAccountId = token.providerAccountId || "";
        const name = token.name;
        const image = token.image;
        const email = token.email || token.picture;
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
    } catch (error) {
        console.error("Error in GET /api/auth:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}