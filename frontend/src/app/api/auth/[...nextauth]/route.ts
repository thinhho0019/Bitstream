import NextAuth, { JWT, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { loginAccount, refreshAccessToken, SyncGoogleAccount } from "@/services/account";
import CredentialsProvider from "next-auth/providers/credentials";
import { log } from "console";
import axios from "axios";
import { use } from "react";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;
console.log(GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google Client ID and Secret must be provided");
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile",
                    access_type: "offline",     // ✅ Bắt buộc
                    prompt: "consent",          // ✅ Ép hỏi lại và gửi refresh_token
                },
            },
        }),
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials!
                console.log("🔐 Authorizing with credentials:", { email, password })
                const res = await loginAccount(email, password);
                if (!res) {
                    console.log("❌ Login failed with credentials")
                    return null;
                }
                console.log("✅ Login successful with credentials:", res)
                // ✅ Trả về user object nếu đăng nhập thành công
                return {
                    id: res.id,
                    name: res.name,
                    email: res.email,
                    image: res.image || "",
                    provider: res.provider || "email",
                    accessToken: res.access_token,
                    refreshToken: res.refresh_token
                }
            },
        }),
        
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            console.log("account:", account);
            console.log("token:", token);
            if (account?.provider === "credentials") {
                return token;
            }
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: ONE_HOUR_IN_MS, // Nếu có expires_in
                    providerAccountId: account.providerAccountId,
                    image: user.image,
                    name: user.name,
                    email: user.email,
                    userId: user.id,
                    id_token: account.id_token,
                };
            }
            // Nếu access token còn hạn thì dùng tiếp
            if (Date.now() < Number(token.accessTokenExpires || 0)) {
                return token;
            }
            // Access token đã hết hạn → refresh
            // return await refreshAccessToken(token as JWT);
            return token;
        },
        async signIn({ profile, user, account }) {
            // ✅ Nếu là đăng nhập qua Google

            if (account?.provider === "google") {
                if (!profile?.email) {
                    return false
                }
                const result = await SyncGoogleAccount({
                    id: user.id,
                    refresh_token: account?.refresh_token || "",
                    email: profile.email,
                    name: profile.name || "",
                    image: user.image || " ",
                    provider: "google",
                })
                return !!result
            }
            // ✅ Nếu là đăng nhập qua credentials (email/password)
            if (account?.provider === "credentials") {
                if (!user?.email) return false
                return true
            }

            // ✅ Default fallback: cho phép đăng nhập
            return true
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}/dashboard`;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken?.toString();
            session.refreshToken = token.refreshToken?.toString();
            session.expires = token.accessTokenExpires?.toString();
            session.user.providerAccountId = token.providerAccountId?.toString();
            session.user.image = token.image?.toString();
            session.user.name = token.name?.toString();
            session.user.email = token.email?.toString();
            session.user.id_token = token.id_token?.toString(); // ✅ Thêm dòng này để client dùng
            return session;
        },

    },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 