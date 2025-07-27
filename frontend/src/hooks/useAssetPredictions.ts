import { useEffect, useState } from "react";
import { AssetPrediction } from "@/types/assetPredictions";
import { Account } from "@/types/account";
import api from "@/services/api";
export const useAssetPrediction = () => {
    const [asset, setAsset] = useState<AssetPrediction[]>([]);
    const [loadingAsset, setLoadingAsset] = useState<boolean>(true);
    const [errorAsset, setErrorAsset] = useState<string | null>(null);
    const getUsetForToken = async () => {
        const res = await fetch("/api/auth");
        if (!res.ok) {
            //fail request get token for api
            return;
        }
        const data = await res.json();
        const dataUser: Account = {
            email: data.email,
            image: data.image,
            name: data.name,
            id: data.userId
        };
        console.log("dataUser", dataUser);
        return dataUser;
    }
    const fetchAsset = async () => {
        const resultToken = await getUsetForToken();
        if (resultToken) {
            const response = await api.get(`/asset-predictions?account_id=${resultToken.id}`);
            if (response.status !== 200) {
                setErrorAsset("Failed to fetch asset");
                throw new Error(`Error fetching asset: ${response.statusText}`);
            }
            const data: AssetPrediction[] = response.data;
            const dataFixStatus = data.map(({ status, ...rest }) => ({ ...rest, status }));
            const sortData = [...dataFixStatus].sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime());
            setAsset(sortData);
            setLoadingAsset(false);
        }
    };
    useEffect(() => {
        fetchAsset();
    }, []);
    return { asset, loadingAsset, errorAsset, refetchAsset: fetchAsset };
}

