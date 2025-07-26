import api from "@/services/api";
import axios from "axios";
import { access } from "fs";
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
        console.log("Syncing Google account with data:", {
            id,
            refresh_token,
            email,
            name,
            image,
            provider
        }); 
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
        console.log("🔄 Refreshing access token", token);
        if (token.provider === "email") {
            const url = process.env.NEXT_PUBLIC_BASE_API_URL + "/refresh-token";
            const refresh_token = token.refreshToken;
            if (!refresh_token) {
                console.error("❌ No refresh token available");
                return {
                    ...token,
                };
            }
            try {
                console.log("🔄 Refreshing access token with refresh_token:", refresh_token);
                const response = await api.post(url, { params: { refresh_token: refresh_token } });
                const refreshToken = response.data;
                return {
                    ...token,
                    accessToken: refreshToken.access_token,
                    accessTokenExpires: refreshToken.exp,
                    refreshToken: token.refreshToken,
                }
            } catch (error) {
                console.error("❌ Error in refreshAccessToken:", error);
                return {
                    ...token,
                };
            }

        }
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
export const loginAccount = async (email: string, password: string, finger_print: string) => {
    try {
        const response = await api.post(
            process.env.NEXT_PUBLIC_BASE_API_URL + "/login",
            {
                email,
                password,
                finger_print
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error logging in account:", error);
        throw new Error("Failed to log in account");
    }
}
export const registerAccount = async (email: string, password: string) => {
    try {
        const response = await api.post(
            process.env.NEXT_PUBLIC_BASE_API_URL + "/accounts",
            {
                email,
                password,
                name: "",
                image: "",
                provider: "email"
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error registering account:", error);
        throw new Error("Failed to register account");
    }
}
export const getInformationAccount = async (access_token: string) => {
    try {
        const response = await api.get(
            process.env.NEXT_PUBLIC_BASE_API_URL + `/get-infor-user`,
            { headers: { Authorization: `Bearer ${access_token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error getting account information:", error);
        throw new Error("Failed to get account information");
    }
}