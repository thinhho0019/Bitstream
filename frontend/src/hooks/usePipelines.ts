import { useEffect, useState } from "react";
import api from "@/services/api";
import { Pipeline } from "@/types/pipelines";

export const usePipelines = () => {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchPipelines = async () => {
        try {
            setLoading(true);
            console.log("Fetching pipelines from API...");
            console.log("Full URL:", `${api.defaults.baseURL}/pipelines`);
            const response = await api.get<Pipeline[]>("/pipelines");
            setPipelines(response.data);
        } catch (err) {
            setError("Failed to fetch pipelines" + err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPipelines();
    }, []);
    return { pipelines, loading, error, refetch: fetchPipelines };
}