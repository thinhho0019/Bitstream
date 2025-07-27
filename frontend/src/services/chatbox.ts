import api from "@/services/api";
export const askChatBox = async ({
    message,
    user_id,
    token
}: {
    message: string;
    user_id: string;
    token: string
}) => {
    try {
        console.log("Asking chat box with message:", message, "and user_id:", user_id,"token:", token);
        const res = await api.post("/assistants/bitcoin", {
            message,
            user_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error syncing Google account:", error);
        throw new Error("Failed to sync Google account");
    }
}
