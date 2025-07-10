import api from "@/services/api";
import axios from "axios";
import { JWT } from "next-auth";
export const SyncGoogleAccount = async ({
    id,
    refresh_token,
    email,
    name,
    image,
    provider }: {
        id: string,
        refresh_token: string,
        email?: string;
        name: string;
        image?: string;
        provider: string;
    }) => {
    try {
        const response = await api.post("/accounts", {
            id,
            refresh_token,
            email,
            name,
            image,
            provider
        });
        return response.data;
    } catch (error) {
        console.error("Error syncing Google account:", error);
        throw new Error("Failed to sync Google account");
    }
}
export const refreshAccessToken = async (token: JWT) => {
    try {
        console.log("expire token");
        console.log(token);
        console.log({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
        });
        const url = "https://oauth2.googleapis.com/token";
        const params = {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
        };

        const response = await axios.post(url, null, {
            params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const refreshToken = response.data;

        return {
            ...token,
            id_token: refreshToken.id_token,
            accessToken: refreshToken.access_token,
            accessTokenExpires: Date.now() + refreshToken.expires_in * 1000,
            refreshToken: refreshToken.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error("❌ Error refreshing access token", error);
        return {
            ...token,
        };
    }
};
