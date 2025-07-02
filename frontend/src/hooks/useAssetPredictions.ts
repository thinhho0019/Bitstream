import { useEffect, useState } from "react";
import { AssetPrediction } from "@/types/assetPredictions";
import api from "@/services/api";
export const useAssetPrediction = () => {
    const [asset, setAsset] = useState<AssetPrediction[]>([]);
    const [loadingAsset, setLoadingAsset] = useState<boolean>(true);
    const [errorAsset, setErrorAsset] = useState<string | null>(null);
    const fetchAsset = async () => {
        const response = await api.get("/asset-predictions?account_id=1");
        if (response.status !== 200) {
            throw new Error(`Error fetching asset: ${response.statusText}`);
            setErrorAsset("Failed to fetch asset");
        }
        setAsset(response.data);
        setLoadingAsset(false);
    };
    useEffect(() => {
        fetchAsset();
    }, []);
    return { asset, loadingAsset, errorAsset, refetchAsset: fetchAsset };
}

