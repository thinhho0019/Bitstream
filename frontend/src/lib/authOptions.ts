// src/lib/authOptions.ts
import { AuthOptions, JWT } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginAccount, refreshAccessToken, SyncGoogleAccount } from "@/services/account";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export const authOptions: AuthOptions = {
    session: { strategy: "jwt" },
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
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password, finger_print } = credentials as {
                    email: string;
                    password: string;
                    finger_print: string;
                };
                const res = await loginAccount(email, password, finger_print);
                if (!res) return null;
                return {
                    id: res.id,
                    name: res.name,
                    email: res.email,
                    image: res.image || "",
                    provider: res.provider || "email",
                    accessToken: res.access_token,
                    refreshToken: res.refresh_token,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            const u = user as {
                id: string;
                email: string;
                name?: string;
                image?: string;
                accessToken: string;
                refreshToken: string;
            };
            if (account?.provider === "credentials" && user) {
                if (Date.now() < Number(token.accessTokenExpires || 0)) {
                    return {
                        accessToken: u.accessToken,
                        refreshToken: u.refreshToken,
                        accessTokenExpires: ONE_HOUR_IN_MS,
                        image: user.image,
                        name: user.name,
                        email: user.email,
                        userId: user.id,
                        id_token: account.id_token,
                        provider: "email",
                    };
                };
                return await refreshAccessToken(token as JWT);
            };
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: ONE_HOUR_IN_MS,
                    image: user.image,
                    name: user.name,
                    email: user.email,
                    userId: user.id,
                    id_token: account.id_token,
                    provider: "google"
                };
            }
            if (Date.now() < Number(token.accessTokenExpires || 0)) {
                return token;
            }
            return await refreshAccessToken(token as JWT);
        },
        async signIn({ profile, user, account }) {
            if (account?.provider === "google") {
                if (!profile?.email) return false;
                const result = await SyncGoogleAccount({
                    id: user.id,
                    refresh_token: account?.refresh_token || "",
                    email: profile.email,
                    name: profile.name || "",
                    image: user.image || " ",
                    provider: "google",
                });
                if (!result) {
                    console.error("❌ Failed to sync Google account");
                    return false;
                }
                user.id = result.id;
                return !!result;
            }
            if (account?.provider === "credentials") {
                if (!user?.email) return false;
                return true;
            }
            return true;
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
            session.user.id_token = token.id_token?.toString();
            session.provider = token.provider?.toString();
            return session;
        },
    },
};
