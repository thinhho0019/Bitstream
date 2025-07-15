import api from "@/services/api";
import { AssetPredictionResponse } from "@/types/assetPredictionResponse";
export const assetPredictionService = async ({
    name,
    current_value,
    next_value,
    expiration_time,
    account_id,
    status,
}: {
    name: string;
    current_value: number;
    next_value: number;
    expiration_time: string;
    account_id: string;
    status: string;
}) => {
    try {
        const response = await api.post("/asset-predictions", <AssetPredictionResponse>{
            name,
            current_value,
            next_value,
            expiration_time,
            account_id,
            status,
        });
        return response.data as AssetPredictionResponse;
    } catch (error) {
        console.error("Error creating asset prediction:", error);
        throw new Error("Failed to create asset prediction");
    }
};


export const deleteAssetPrediction = async ({
    id, token_id 
}: { id: number , token_id:string}) => {
    try {
        const response = await api.delete(`/asset-predictions/${id}`,{
            headers:{
                Authorization:`Bearer ${token_id}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error delete asset prediction!", error);
        throw new Error("Fail delete asset prediction");
    }
};
