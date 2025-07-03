import api from "@/services/api";
export const SyncGoogleAccount = async({  email,
    name,
    image,
    provider_account_id,
    provider}: {
    email?: string;
    name: string;
    image?: string;
    provider_account_id:string,
    provider: string;
}) =>{
    try {
        console.log({
            email,
            name,
            image,
            provider_account_id,
            provider
        });
        const response = await api.post("/accounts", {
            email,
            name,
            image,
            provider_account_id,
            provider
        });
        return response.data;
    } catch (error) {
        console.error("Error syncing Google account:", error);
        throw new Error("Failed to sync Google account");
    }
}