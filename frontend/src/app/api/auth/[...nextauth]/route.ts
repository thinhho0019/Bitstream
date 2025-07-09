import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { refreshAccessToken, SyncGoogleAccount } from "@/services/account";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
console.log(GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google Client ID and Secret must be provided");
}

export const authOptions: NextAuthOptions = {
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
            console.log("🔁 JWT callback called");
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: Date.now() + (account.expires_at || 3600) * 1000, // Nếu có expires_in
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
            return await refreshAccessToken(token);
        },

        async signIn({ profile, account, user }) {
            if (!profile?.email) {
                return false; // Prevent sign-in if email is not available
            }
            const result = await SyncGoogleAccount({
                id: user.id,
                email: profile.email,
                name: profile.name || "",
                image: user.image || " ",
                provider: "google",
            });
            if (!result) return false;
            return true; // Allow sign-in
        },
        async redirect({ url, baseUrl }) {
            // Sau khi login thành công, chuyển đến trang /home
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