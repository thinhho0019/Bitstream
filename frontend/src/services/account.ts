import api from "@/services/api";
export const SyncGoogleAccount = async ({
    id,
    email,
    name,
    image,
    provider }: {
        id: string,
        email?: string;
        name: string;
        image?: string;
        provider: string;
    }) => {
    try {
        const response = await api.post("/accounts", {
            id,
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