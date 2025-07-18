import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SyncGoogleAccount } from "@/services/account";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google Client ID and Secret must be provided");
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
        async signIn({ profile }) {

            if (!profile?.email) {
                return false; // Prevent sign-in if email is not available
            }
            const result = await SyncGoogleAccount({
                email: profile.email,
                name: profile.name || "",
                image: profile.image || " ",
                provider: "google",
            });
            return true; // Allow sign-in
        },
        async redirect({ url, baseUrl }) {
            // Sau khi login thành công, chuyển đến trang /home
            return `${baseUrl}/`;
        }
    },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 