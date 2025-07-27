
export type AssetPredictionResponse = {
    id: string;
    name: string;
    id_token?: string;
    current_value: number;
    next_value: number;
    expiration_time: string;
    account_id: string;
    status: string;
};