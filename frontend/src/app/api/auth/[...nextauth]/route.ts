import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SyncGoogleAccount } from "@/services/account";
import axios from "axios";
import { access } from "fs";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google Client ID and Secret must be provided");
}
async function refreshAccessToken(token: any) {
    try {
        const url = "https://oauth2.googleapis.com/token";
        const response = await axios.post(url, null, {
            params: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        const refreshToken = response.data;
        return {
            ...token,
            accessToken: refreshToken.access_token,
            accessTokenExpires: Date.now() + refreshToken.expires_in * 1000,
            refreshToken: refreshToken.refresh_token ?? token.refreshToken,
        }
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}
const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: Date.now() + 3600 * 1000,
                    providerAccountId: account.providerAccountId,
                    image: user.image,
                    name: user.name,
                    email: user.email,
                    userId: user.id
                }
            }
            if (token?.exp) {
                if (Date.now() < Number(token.exp)) {
                    return await refreshAccessToken(token);
                }
            }
            return token;
        },
        async signIn({ profile, account, user }) {
            console.log(user);
            if (!profile?.email) {
                return false; // Prevent sign-in if email is not available
            }
            const result = await SyncGoogleAccount({
                id: user.id,
                email: profile.email,
                name: profile.name || "",
                image: user.image || " ",
                provider_account_id: account?.providerAccountId || "",
                provider: "google",
            });
            if (!result) return false;
            return true; // Allow sign-in
        },
        async redirect({ url, baseUrl }) {
            // Sau khi login thành công, chuyển đến trang /home
            return `${baseUrl}/dashboard`;
        }

    },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 